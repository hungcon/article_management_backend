/* eslint-disable func-names */
const mongoose = require('mongoose');
const Configuration = require('../../models/configuration');
// const RSSConfig = require('../../models/rssConfig');
const HtmlConfig = require('../../models/htmlConfig');
const BlockConfig = require('../../models/blockConfig');
const Website = require('../../models/website');
const Category = require('../../models/category');
// const { addHtmlConfig, deleteHtmlConfig } = require('./html');
// const { addRssConfig, deleteRssConfig } = require('./rss');

const getConfiguration = async () => {
  const configuration = await Configuration.find({})
    .populate({
      path: 'website',
      model: Website,
    })
    .populate({
      path: 'category',
      model: Category,
    });
  // .populate({
  //   path: 'rss',
  //   model: RSSConfig,
  // })
  // .populate({
  //   path: 'html',
  //   model: HtmlConfig,
  //   populate: {
  //     path: 'blocksConfiguration',
  //     modal: BlockConfig,
  //   },
  // });
  return configuration;
};

const getConfigByWebsite = async (website, category) => {
  const configuration = await Configuration.findOne({
    $and: [
      { website: (await Website.findOne({ name: website.name }))._id },
      { category: (await Category.findOne({ name: category.name }))._id },
    ],
  });
  return configuration;
};

const getArticleConfig = async (configId) => {
  const configuration = await Configuration.findById(configId);
  return configuration;
};

const updateArticleConfig = async ({
  articleVal,
  articleDemoLink,
  configId,
}) => {
  await Configuration.findByIdAndUpdate(configId, {
    $set: {
      articleDemoLink,
      article: articleVal,
      updatedAt: Date.now(),
    },
  });
};

const addConfig = async ({ general, config, article }) => {
  const newConfig = general;
  newConfig.turnOnSchedule = general.turnOnSchedule ? '01' : '02';
  newConfig.autoSynthetic = general.autoSynthetic ? '01' : '02';
  newConfig.article = article;
  newConfig.website = (await Website.findOne({ name: general.website }))._id;
  newConfig.category = (await Category.findOne({ name: general.category }))._id;
  newConfig.createdAt = Date.now();
  newConfig.updatedAt = Date.now();
  const blocksConfiguration = [];
  if (general.crawlType === 'HTML') {
    const addBlock = config.blocksConfiguration;
    for (let i = 0; i < addBlock.length; i += 1) {
      const blockConfiguration = {
        _id: mongoose.Types.ObjectId(),
        blockSelector: addBlock[i].blockSelector,
        configuration: {
          redundancySelectors: addBlock[i].configuration.redundancySelectors,
          itemSelector: addBlock[i].configuration.itemSelector,
          titleSelector: addBlock[i].configuration.titleSelector,
          linkSelector: addBlock[i].configuration.linkSelector,
        },
      };
      blocksConfiguration.push(blockConfiguration);
    }
    const html = {
      _id: mongoose.Types.ObjectId(),
      url: config.url,
      contentRedundancySelectors: config.contentRedundancySelectors,
      blocksConfiguration,
    };
    newConfig.html = html;
    Configuration.create(newConfig);
  } else {
    const rssConfig = {
      _id: mongoose.Types.ObjectId(),
      url: config.url,
      configuration: {
        itemSelector: config.configuration.itemSelector,
        titleSelector: config.configuration.titleSelector,
        linkSelector: config.configuration.linkSelector,
        sapoSelector: config.configuration.sapoSelector,
        publicDateSelector: config.configuration.publicDateSelector,
      },
    };
    newConfig.rss = rssConfig;
    Configuration.create(newConfig);
  }
};

const updateConfig = async ({ configId, config }) => {
  await Configuration.findOneAndUpdate(
    { _id: configId },
    {
      $set: {
        website: (await Website.findOne({ name: config.website }))._id,
        category: (await Category.findOne({ name: config.category }))._id,
        schedules: config.schedules,
        turnOnSchedule: !config.turnOnSchedule ? '02' : '01',
        autoSynthetic: !config.autoSynthetic ? '02' : '01',
        updatedAt: Date.now(),
      },
    },
  );
};

const deleteConfig = async (configId) => {
  await Configuration.findByIdAndDelete(configId);
};

module.exports = {
  getConfiguration,
  getConfigByWebsite,
  getArticleConfig,
  updateArticleConfig,
  addConfig,
  updateConfig,
  deleteConfig,
};
