const cron = require('node-cron');
const configService = require('../config');

const crawlLinks = async (
  type,
  multi,
  website,
  category,
  articleConfiguration,
) => {
  console.log('Running', website, category);
  console.log(type);
  console.log(multi);
  console.log(articleConfiguration);
};

const runSchedule = async () => {
  let allConfigurations = await configService.getConfiguration();
  allConfigurations = allConfigurations.filter(
    (configuration) => configuration.status === '01',
  );
  allConfigurations.forEach((configuration) => {
    const {
      crawlType,
      schedules,
      rss,
      html,
      article,
      website,
      category,
    } = configuration;

    schedules.forEach((schedule) => {
      cron.schedule(
        schedule,
        crawlLinks(
          crawlType,
          crawlType === 'RSS' ? rss : html,
          website,
          category,
          article,
        ),
      );
    });
  });
  return { status: 1 };
};

module.exports = {
  runSchedule,
};
