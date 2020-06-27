/* eslint-disable func-names */
const mongoose = require('mongoose');
const Configuration = require('../../../models/configuration');

const addHtmlConfig = async ({ html, addBlock, configId }) => {
  const configuration = await Configuration.findOne({ _id: configId });
  const listHtmlConfig = configuration.html;
  const blocksConfiguration = [];
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
  const newHtmlConfig = {
    _id: mongoose.Types.ObjectId(),
    url: html.url,
    contentRedundancySelectors: html.contentRedundancySelectors,
    blocksConfiguration,
  };
  listHtmlConfig.push(newHtmlConfig);
  await Configuration.findOneAndUpdate(
    { _id: configId },
    {
      $set: {
        html: listHtmlConfig,
        updatedAt: Date.now(),
      },
    },
  );
};

const deleteHtmlConfig = async ({ configId, htmlConfigId }) => {
  const configuration = await Configuration.findOne({ _id: configId });
  let listHtmlConfig = configuration.html;
  listHtmlConfig = listHtmlConfig.filter(
    (html) => html._id.toString() !== htmlConfigId,
  );
  await Configuration.findOneAndUpdate(
    { _id: configId },
    {
      $set: {
        html: listHtmlConfig,
        updatedAt: Date.now(),
      },
    },
  );
};

const updateHtmlConfig = async ({ htmlId, html, configId }) => {
  const configuration = await Configuration.findOne({ _id: configId });
  const listHtmlConfig = configuration.html;
  for (let i = 0; i < listHtmlConfig.length; i += 1) {
    if (listHtmlConfig[i]._id.toString() === htmlId) {
      listHtmlConfig[i].url = html.url;
      listHtmlConfig[i].contentRedundancySelectors =
        html.contentRedundancySelectors;
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
  addHtmlConfig,
  updateHtmlConfig,
  deleteHtmlConfig,
};
