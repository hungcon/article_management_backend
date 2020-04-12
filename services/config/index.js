/* eslint-disable func-names */
const Configuration = require('../../models/configuration');
const RSSConfig = require('../../models/rssConfig');
const HtmlConfig = require('../../models/htmlConfig');
const BlockConfig = require('../../models/blockConfig');
const { addHtmlConfig, deleteHtmlConfig } = require('./html');
const { addRssConfig, deleteRssConfig } = require('./rss');

const getConfiguration = async () => {
  const configuration = await Configuration.find({})
    .populate({
      path: 'rss',
      model: RSSConfig,
    })
    .populate({
      path: 'html',
      model: HtmlConfig,
      populate: {
        path: 'blocksConfiguration',
        modal: BlockConfig,
      },
    });
  return configuration;
};

const addConfig = async ({ general, config, article }) => {
  const newConfig = general;
  newConfig.article = article;
  newConfig.createdAt = Date.now();
  newConfig.updatedAt = Date.now();
  if (general.crawlType === 'HTML') {
    Configuration.create(newConfig, function (err, doc) {
      if (err) {
        console.log(err);
      }
      const addBlock = config.blocksConfiguration;
      const html = {
        url: config.url,
        contentRedundancySelectors: config.contentRedundancySelectors,
      };
      const configId = doc._id;
      addHtmlConfig({ html, addBlock, configId });
    });
  } else {
    Configuration.create(newConfig, function (err, doc) {
      if (err) {
        console.log(err);
      }
      const rssConfig = {
        url: config.url,
        itemSelector: config.configuration.itemSelector,
        titleSelector: config.configuration.titleSelector,
        linkSelector: config.configuration.linkSelector,
        sapoSelector: config.configuration.sapoSelector,
        publishDateSelector: config.configuration.publishDateSelector,
      };
      const configId = doc._id;
      addRssConfig({ configId, rssConfig });
    });
  }
};

const updateConfig = async ({ configId, config }) => {
  console.log(configId);
  console.log(config);
  await Configuration.update(
    { _id: configId },
    {
      $set: {
        'website.name': config.website,
        'category.name': config.category,
        queue: config.queue,
        schedules: config.schedules,
        status: !config.status ? '02' : '01',
        updatedAt: Date.now(),
      },
    },
  );
};

const deleteConfig = async (configId) => {
  const config = await Configuration.findById(configId);
  if (config.crawlType === 'HTML') {
    config.html.forEach(async (htmlConfigId) => {
      await deleteHtmlConfig({ configId, htmlConfigId });
    });
  } else {
    config.rss.forEach(async (rssConfigId) => {
      await deleteRssConfig({ configId, rssConfigId });
    });
  }
  await Configuration.findByIdAndDelete(configId);
};

module.exports = {
  getConfiguration,
  addConfig,
  updateConfig,
  deleteConfig,
};
