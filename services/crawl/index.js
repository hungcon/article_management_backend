const cron = require('node-cron');
const configService = require('../config');
const { extractLinks } = require('./extract');

const crawlLinks = async (
  type,
  multi,
  website,
  category,
  articleConfiguration,
) => {
  console.log('Running', website, category);
  console.log(articleConfiguration);
  const listArticlesCollected = [];
  const { error, listArticles } = await extractLinks(type, multi);
  for (const article of listArticles) {
    const { link, title } = article;
    if (link && title) {
      listArticlesCollected.push(article);
    }
  }
  if (error) {
    console.log(`crawlLinks: ${error}`);
  }
  console.log(listArticlesCollected);
  return listArticlesCollected;
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
