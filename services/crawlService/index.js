/* eslint-disable func-names */
/* eslint-disable no-undef */
const cron = require('node-cron');
const configService = require('../configService');
const { getPublicDate } = require('../../utils/date');
const { extractLinks, extractArticle } = require('./extract');
const {
  normalizeArticle,
  syntheticArticle,
} = require('../articleService/validService');
const {
  isExistedInArticle,
  insertArticle,
  isCategoryAdded,
  updateCategory,
  updateStatus,
} = require('../articleService/validService');

const {
  isExistedInInvalidArticle,
  isInvalidCategoryAdded,
  updateInvalidCategory,
  insertInvalidArticle,
} = require('../articleService/invalidService');

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
  autoSynthetic,
  articleConfiguration,
) => {
  console.log('Running', website.name, category.name);
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
    autoSynthetic,
    articleConfiguration,
  }));
  QUEUE_LINKS = [...QUEUE_LINKS, ...listArticlesWithConfiguration];
  console.log('QUEUE LINKS: ', QUEUE_LINKS.length);
  return { status: 1 };
};

const crawlArticle = async (articleInfo, articleConfiguration) => {
  try {
    const { link, publishDate, website, category } = articleInfo;
    const { error, article } = await extractArticle(link, articleConfiguration);
    if (error) {
      console.log(error);
    }
    return {
      article: {
        link,
        title: article.title,
        sapo: article.sapo,
        publicDate: await getPublicDate(publishDate, article.publicDate),
        category: category._id,
        website: website._id,
        text: `${article.text}`,
        numberOfWords: !article.text ? 0 : article.text.split(' ').length,
      },
    };
  } catch (error) {
    console.log(`crawlArticle: ${error}`);
    return { error };
  }
};

const saveArticle = () => {
  const CHECK_QUEUE_LINKS_TIME = 7 * 60 * 1000;
  // const CHECK_QUEUE_LINKS_TIME = 30 * 1000;
  setInterval(() => {
    if (QUEUE_LINKS.length && !RUNNING_WORKER_FLAG) {
      worker();
    }
  }, CHECK_QUEUE_LINKS_TIME);
};

const breakTime = (time) => new Promise((resolve) => setTimeout(resolve, time));

const worker = async () => {
  const BREAK_TIME = 7 * 60 * 1000;
  // const BREAK_TIME = 30 * 1000;
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

const invalidArticleWorker = async (link, title, category, website, reason) => {
  if (await isExistedInInvalidArticle(link, title)) {
    if (!(await isInvalidCategoryAdded(link, title, category))) {
      const updatedInvalidArticle = await updateInvalidCategory(
        link,
        title,
        category._id,
      );
      console.log('Updated invalid article: ', updatedInvalidArticle.title);
      return;
    }
  }
  const newInvalidArticle = {
    title,
    link,
    website: website._id,
    category: category._id,
    reason,
  };
  const newInvalidArticleInserted = await insertInvalidArticle(
    newInvalidArticle,
  );
  console.log('Inserted invalid article: ', newInvalidArticleInserted.title);
};

const articleWorker = async (articleInfoAndConfiguration) => {
  try {
    const {
      articleConfiguration,
      ...articleInfo
    } = articleInfoAndConfiguration;
    const { link, title, website, category, autoSynthetic } = articleInfo;
    if (await isExistedInArticle(link, title)) {
      if (!(await isCategoryAdded(link, title, category))) {
        const updatedArticle = await updateCategory(link, title, category._id);
        console.log('Updated article: ', updatedArticle.title);
        return { status: 1 };
      }
      throw new Error('Article is existed');
    }
    const { error, article } = await crawlArticle(
      articleInfo,
      articleConfiguration,
    );
    if (error) {
      await invalidArticleWorker(
        link,
        title,
        category,
        website,
        'Thu thập lỗi',
      );
      throw error;
    }
    if (isValidArticle(article)) {
      // Thêm bài báo
      const newArticle = await insertArticle(article);
      console.log('Inserted article: ', newArticle.title);
      const articleId = newArticle._id;
      // Chuẩn hoá máy
      await normalizeArticle(articleId);
      if (autoSynthetic === '01') {
        setTimeout(async function () {
          // Tổng hợp
          await syntheticArticle(articleId);
        }, 3 * 60 * 1000);
      } else {
        setTimeout(async function () {
          await updateStatus(articleId);
          console.log('Chuyển trạng thái bài báo thành đang chuẩn hoá tay');
        }, 3 * 60 * 1000);
      }
    } else {
      await invalidArticleWorker(
        link,
        title,
        category,
        website,
        'Số từ nhỏ hơn 100',
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
    (configuration) => configuration.turnOnSchedule === '01',
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
      autoSynthetic,
    } = configuration;
    if (schedules.length !== 0) {
      schedules.forEach((schedule) => {
        // eslint-disable-next-line func-names
        const task = cron.schedule(schedule, function () {
          crawlLinks(
            crawlType,
            crawlType === 'RSS' ? rss : html,
            website,
            category,
            autoSynthetic,
            article,
          );
        });
        TASKS.push(task);
      });
    }
  });
  saveArticle();
  return { status: 1 };
};

const reRunSchedule = async () => {
  QUEUE_LINKS = [];
  TASKS.forEach((task) => {
    task.destroy();
    console.log('Task destroyed');
  });
  runSchedule();
  return { status: 1 };
};

const stopSchedule = async () => {
  TASKS.forEach((task) => {
    task.destroy();
    console.log('Task destroyed');
  });
  return { status: 1 };
};

module.exports = {
  reRunSchedule,
  stopSchedule,
  runSchedule,
  saveArticle,
};
