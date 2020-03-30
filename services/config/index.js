/* eslint-disable func-names */
/* eslint-disable no-console */
const Configuration = require('../../models/configuration');
const RSSConfig = require('../../models/RSSConfig');
const ArticleConfig = require('../../models/articleConfig');

const getConfiguration = async () => {
  const configuration = await Configuration.find({})
    .populate({
      path: 'rss',
      model: RSSConfig,
    })
    .populate({
      path: 'article',
      model: ArticleConfig,
    });
  return configuration;
};

module.exports = { getConfiguration };
