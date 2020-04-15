/* eslint-disable no-unused-vars */
/* eslint-disable no-const-assign */
// const cron = require('node-cron');
const Parser = require('rss-parser');
const Crawler = require('crawler');
const configService = require('../config');

const parser = new Parser();

const crawlArticle = async () => {
  // const configurations = await configService.getConfiguration();
  // configurations.forEach(async (config) => {
  //   if (config.crawlType === 'RSS' && config.status === '01') {
  //     let listLink = await getLink(config);
  //     listLink = listLink.filter(
  //       (li, idx, self) =>
  //         self
  //           .map((itm) => itm.link + itm.category)
  //           .indexOf(li.link + li.category) === idx,
  //     );
  //   }
  // });
};

// const getLink = async (config) => {
//   const { rss } = config;
//   const listLink = [];
//   for (let i = 0; i < rss.length; i += 1) {
//     const feed = await parser.parseURL(rss[i].url);
//     feed.items.forEach((item) => {
//       item.website = config.website.name;
//       item.category = config.category.name;
//       listLink.push(item);
//     });
//   }
//   return listLink;
// };

module.exports = crawlArticle;
