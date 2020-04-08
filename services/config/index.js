/* eslint-disable func-names */
const Configuration = require('../../models/configuration');
const RSSConfig = require('../../models/rssConfig');
const HtmlConfig = require('../../models/htmlConfig');
const BlockConfig = require('../../models/blockConfig');

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

const deleteConfig = async (configId) => {
  await Configuration.findByIdAndDelete(configId);
};

const deleteHtmlConfig = async ({ configId, htmlConfigId }) => {
  await Configuration.findByIdAndUpdate(configId, {
    $pull: { html: htmlConfigId },
  });
  await HtmlConfig.findByIdAndDelete(htmlConfigId);
};

const deleteBlockConfig = async ({ htmlConfigId, blockConfigId }) => {
  await HtmlConfig.findByIdAndUpdate(htmlConfigId, {
    $pull: { blocksConfiguration: blockConfigId },
  });
  await BlockConfig.findByIdAndDelete(blockConfigId);
};

module.exports = {
  getConfiguration,
  deleteConfig,
  deleteHtmlConfig,
  deleteBlockConfig,
};
