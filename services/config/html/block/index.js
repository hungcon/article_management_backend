const mongoose = require('mongoose');
const Configuration = require('../../../../models/configuration');

const addBlockConfig = async ({ html, block, htmlId, configId }) => {
  const configuration = await Configuration.findOne({ _id: configId });
  const listHtmlConfig = configuration.html;
  block._id = mongoose.Types.ObjectId();
  for (let i = 0; i < listHtmlConfig.length; i += 1) {
    if (listHtmlConfig[i]._id.toString() === htmlId) {
      listHtmlConfig[i].url = html.url;
      listHtmlConfig[i].contentRedundancySelectors =
        html.contentRedundancySelectors;
      listHtmlConfig[i].blocksConfiguration.push(block);
    }
  }
  await Configuration.findByIdAndUpdate(configId, {
    $set: {
      html: listHtmlConfig,
      updatedAt: Date.now(),
    },
  });
};

const updateBlockConfig = async ({ blockConfigId, block, configId }) => {
  const configuration = await Configuration.findOne({ _id: configId });
  const listHtmlConfig = configuration.html;
  for (let i = 0; i < listHtmlConfig.length; i += 1) {
    const { blocksConfiguration } = listHtmlConfig[i];
    for (let j = 0; j < blocksConfiguration.length; j += 1) {
      if (blocksConfiguration[j]._id.toString() === blockConfigId) {
        blocksConfiguration[j].blockSelector = block.blockSelector;
        blocksConfiguration[j].configuration = block.configuration;
      }
    }
  }
  await Configuration.findByIdAndUpdate(configId, {
    $set: {
      html: listHtmlConfig,
      updatedAt: Date.now(),
    },
  });
};

const deleteBlockConfig = async ({ htmlConfigId, blockConfigId, configId }) => {
  const configuration = await Configuration.findOne({ _id: configId });
  const listHtmlConfig = configuration.html;
  for (let i = 0; i < listHtmlConfig.length; i += 1) {
    if (listHtmlConfig[i]._id.toString() === htmlConfigId) {
      listHtmlConfig[i].blocksConfiguration = listHtmlConfig[
        i
      ].blocksConfiguration.filter(
        (block) => block._id.toString() !== blockConfigId,
      );
    }
  }
  await Configuration.findByIdAndUpdate(configId, {
    $set: {
      html: listHtmlConfig,
      updatedAt: Date.now(),
    },
  });
};

module.exports = {
  addBlockConfig,
  deleteBlockConfig,
  updateBlockConfig,
};
