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

const addHtmlConfig = async ({ html, addBlock, configId }) => {
  console.log(html);
  console.log(addBlock);
  console.log(configId);
  await HtmlConfig.create(html, async function (err, doc) {
    if (err) {
      console.log(err);
    }
    await Configuration.findByIdAndUpdate(configId, {
      $push: { html: doc._id },
    });
    if (addBlock.length !== 0) {
      for (let i = 0; i < addBlock.length; i += 1) {
        await BlockConfig.create(addBlock[i], async function (
          blockErr,
          addedBlock,
        ) {
          if (blockErr) {
            console.log(blockErr);
          }
          await HtmlConfig.findByIdAndUpdate(doc._id, {
            $push: { blocksConfiguration: addedBlock._id },
          });
        });
      }
    }
  });
};

const deleteHtmlConfig = async ({ configId, htmlConfigId }) => {
  await Configuration.findByIdAndUpdate(configId, {
    $pull: { html: htmlConfigId },
  });
  const htmlConfigDoc = await HtmlConfig.findById(htmlConfigId);
  const listBlockId = htmlConfigDoc.blocksConfiguration;
  listBlockId.forEach(async (blockId) => {
    await BlockConfig.findByIdAndDelete(blockId);
  });
  await HtmlConfig.findByIdAndDelete(htmlConfigId);
};

const updateHtmlConfig = async ({ htmlId, html }) => {
  await HtmlConfig.findByIdAndUpdate(htmlId, {
    $set: {
      url: html.url,
      contentRedundancySelectors: html.contentRedundancySelectors,
    },
  });
};

const addBlockConfig = async ({ html, block, htmlId }) => {
  console.log(block);
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
};

const updateBlockConfig = async ({ blockConfigId, block }) => {
  console.log(block);
  await BlockConfig.findByIdAndUpdate(blockConfigId, block);
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
  addHtmlConfig,
  updateHtmlConfig,
  deleteHtmlConfig,
  addBlockConfig,
  deleteBlockConfig,
  updateBlockConfig,
};
