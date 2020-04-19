/* eslint-disable no-undef */
const cron = require('node-cron');
const configService = require('../config');
const { getPublicDate } = require('../../utils/date');
const { extractLinks, extractArticle } = require('./extract');
const { sendArticleToQueue } = require('../kafka');

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
    if (link && title) {
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
  for (let i = 0; i < listArticlesWithConfiguration.length; i += 1) {
    const {
      // eslint-disable-next-line no-shadow
      articleConfiguration,
      ...articleInfo
    } = listArticlesWithConfiguration[i];

    const { error: crawlArticleError, article } = await crawlArticle(
      articleInfo,
      articleConfiguration,
    );
    if (crawlArticleError) {
      console.log(crawlArticleError);
    }
    // Send article to kafka
    if (article) {
      sendArticleToQueue(article);
    } else {
      console.log(articleInfo);
      // eslint-disable-next-line no-continue
      continue;
    }
  }
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
        numberOfWords: article.text.split(' ').length,
        images: article.images,
      },
    };
  } catch (error) {
    console.log(`crawlArticle: ${error}`);
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
};
