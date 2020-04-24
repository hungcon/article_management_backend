/* eslint-disable no-undef */
const cron = require('node-cron');
const configService = require('../config');
const { getPublicDate } = require('../../utils/date');
const { extractLinks, extractArticle } = require('./extract');
const {
  isExistedInArticle,
  isExistedInInvalidArticle,
  insertArticle,
  isCategoryAdded,
  updateCategory,
  insertInvalidArticle,
} = require('../article');
// const { sendArticleToQueue } = require('../kafka');

const isExistedInQueue = (link, title) => {
  const article = QUEUE_LINKS.find(
    // eslint-disable-next-line no-shadow
    (article) => article.link === link || article.title === title,
  );
  return !!article;
};

const isValidArticle = (article) => {
  try {
    const MINIMUM_OF_WORDS = 100;
    const { link, title, text } = article;
    if (!link || !title || !text) return false;

    if (text.split(' ').length < MINIMUM_OF_WORDS) return false;

    return true;
  } catch (error) {
    return false;
  }
};

const crawlLinks = async (
  type,
  multi,
  website,
  category,
  articleConfiguration,
) => {
  console.log('Running', website, category);
  const listArticlesPlaceholder = [];
  const { error, listArticles } = await extractLinks(type, multi);
  for (const article of listArticles) {
    const { link, title } = article;
    if (
      link &&
      title &&
      !(await isExistedInArticle(link, title)) &&
      !(await isExistedInInvalidArticle(link, title)) &&
      !isExistedInQueue(link, title)
    ) {
      listArticlesPlaceholder.push(article);
    }
  }
  // Remove duplicate article when config have 2 same rss (html) config
  const listArticlesClean = listArticlesPlaceholder.filter(
    (li, idx, self) =>
      self.map((itm) => itm.link + itm.title).indexOf(li.link + li.title) ===
      idx,
  );
  if (error) {
    console.log(`crawlLinks: ${error}`);
  }
  // Add configuration
  const listArticlesWithConfiguration = listArticlesClean.map((article) => ({
    ...article,
    website,
    category,
    articleConfiguration,
  }));
  QUEUE_LINKS = [...QUEUE_LINKS, ...listArticlesWithConfiguration];
  console.log('QUEUE LINKS: ', QUEUE_LINKS.length);
  return { status: 1 };
};

const crawlArticle = async (articleInfo, articleConfiguration) => {
  try {
    const { link, title, publishDate, website, category } = articleInfo;
    const { error, article } = await extractArticle(link, articleConfiguration);
    if (error) {
      console.log(error);
    }
    return {
      article: {
        link,
        title,
        sapo: article.sapo,
        publicDate: await getPublicDate(publishDate, article.publicDate),
        thumbnail: article.thumbnail,
        category,
        website,
        sourceCode: article.sourceCode,
        text: `${article.title}\n\n${article.text}`,
        tags: article.tags || [],
        numberOfWords: !article.text ? 0 : article.text.split(' ').length,
        images: article.images,
      },
    };
  } catch (error) {
    console.log(`crawlArticle: ${error}`);
    return { error };
  }
};

const saveArticle = () => {
  const CHECK_QUEUE_LINKS_TIME = 0.5 * 60 * 1000;
  setInterval(() => {
    if (QUEUE_LINKS.length && !RUNNING_WORKER_FLAG) {
      worker();
    }
  }, CHECK_QUEUE_LINKS_TIME);
};

const breakTime = (time) => new Promise((resolve) => setTimeout(resolve, time));

const worker = async () => {
  const BREAK_TIME = 3000;
  try {
    RUNNING_WORKER_FLAG = true;
    while (QUEUE_LINKS.length) {
      const articleInfoAndConfiguration = QUEUE_LINKS.shift();
      console.log(
        'Getting article: ',
        JSON.stringify({
          title: articleInfoAndConfiguration.title,
          link: articleInfoAndConfiguration.link,
        }),
      );
      await articleWorker(articleInfoAndConfiguration);
      await breakTime(BREAK_TIME);
      console.log('====== QUEUE_LINKS :', QUEUE_LINKS.length, ' =========');
    }
    RUNNING_WORKER_FLAG = false;
  } catch (error) {
    console.log(`worker: `, error);
  }
};

const articleWorker = async (articleInfoAndConfiguration) => {
  try {
    const {
      articleConfiguration,
      ...articleInfo
    } = articleInfoAndConfiguration;
    const { link, title, website, category } = articleInfo;
    if (await isExistedInArticle(link, title)) {
      if (!(await isCategoryAdded(link, title, category))) {
        const updatedArticle = await updateCategory(link, title, category);
        console.log('Updated article: ', updatedArticle.title);
        return { status: 1 };
      }
      throw new Error('Article is existed');
    }
    const { error, article } = await crawlArticle(
      articleInfo,
      articleConfiguration,
    );
    if (error) throw error;
    if (isValidArticle(article)) {
      const newArticle = await insertArticle(article);
      console.log('Inserted article: ', newArticle.title);
    } else {
      const newInvalidArticle = {
        title,
        link,
        website,
        category,
      };
      const newInvalidArticleInserted = await insertInvalidArticle(
        newInvalidArticle,
      );
      console.log(
        'Inserted invalid article: ',
        newInvalidArticleInserted.title,
      );
    }
    return { status: 1 };
  } catch (error) {
    console.log(`articleWorker:  `, error);
    return { error };
  }
};

const runSchedule = async () => {
  let configurations = await configService.getConfiguration();
  configurations = configurations.filter(
    (configuration) => configuration.status === '01',
  );
  configurations.forEach((configuration) => {
    const {
      crawlType,
      schedules,
      rss,
      html,
      article,
      website,
      category,
    } = configuration;
    if (schedules.length !== 0) {
      schedules.forEach((schedule) => {
        // eslint-disable-next-line func-names
        cron.schedule(schedule, function () {
          crawlLinks(
            crawlType,
            crawlType === 'RSS' ? rss : html,
            website,
            category,
            article,
          );
        });
      });
    }
  });

  return { status: 1 };
};

module.exports = {
  runSchedule,
  saveArticle,
};
