const HtmlConfig = require('../../../../models/htmlConfig');
const BlockConfig = require('../../../../models/blockConfig');
const Configuration = require('../../../../models/configuration');

const addBlockConfig = async ({ html, block, htmlId, configId }) => {
  // eslint-disable-next-line func-names
  await BlockConfig.create(block, async function (err, doc) {
    if (err) {
      console.log(err);
    }
    await HtmlConfig.findByIdAndUpdate(htmlId, {
      $set: {
        url: html.url,
        contentRedundancySelectors: html.contentRedundancySelectors,
      },
      $push: {
        // eslint-disable-next-line no-undef
        blocksConfiguration: doc._id,
      },
    });
  });
  await Configuration.findByIdAndUpdate(configId, {
    $set: { updatedAt: Date.now() },
  });
};

const updateBlockConfig = async ({ blockConfigId, block, configId }) => {
  await BlockConfig.findByIdAndUpdate(blockConfigId, block);
  await Configuration.findByIdAndUpdate(configId, {
    $set: { updatedAt: Date.now() },
  });
};

const deleteBlockConfig = async ({ htmlConfigId, blockConfigId, configId }) => {
  await HtmlConfig.findByIdAndUpdate(htmlConfigId, {
    $pull: { blocksConfiguration: blockConfigId },
  });
  await BlockConfig.findByIdAndDelete(blockConfigId);
  await Configuration.findByIdAndUpdate(configId, {
    $set: { updatedAt: Date.now() },
  });
};

module.exports = {
  addBlockConfig,
  deleteBlockConfig,
  updateBlockConfig,
};
