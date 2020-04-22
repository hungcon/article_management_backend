/* eslint-disable func-names */
const Configuration = require('../../../models/configuration');
const HtmlConfig = require('../../../models/htmlConfig');
const BlockConfig = require('../../../models/blockConfig');

const addHtmlConfig = async ({ html, addBlock, configId }) => {
  await HtmlConfig.create(html, async function (err, doc) {
    if (err) {
      console.log(err);
    }
    await Configuration.findByIdAndUpdate(configId, {
      $push: { html: doc._id },
      $set: { updatedAt: Date.now() },
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
    $set: { updatedAt: Date.now() },
  });
  const config = await Configuration.findById(configId);
  if (config.html.length === 0) {
    await Configuration.findByIdAndUpdate(configId, {
      $set: {
        status: '02',
      },
    });
  }
  const htmlConfigDoc = await HtmlConfig.findById(htmlConfigId);
  const listBlockId = htmlConfigDoc.blocksConfiguration;
  listBlockId.forEach(async (blockId) => {
    await BlockConfig.findByIdAndDelete(blockId);
  });
  await HtmlConfig.findByIdAndDelete(htmlConfigId);
};

const updateHtmlConfig = async ({ htmlId, html, configId }) => {
  await HtmlConfig.findByIdAndUpdate(htmlId, {
    $set: {
      url: html.url,
      contentRedundancySelectors: html.contentRedundancySelectors,
    },
  });
  await Configuration.findByIdAndUpdate(configId, {
    $set: { updatedAt: Date.now() },
  });
};

module.exports = {
  addHtmlConfig,
  updateHtmlConfig,
  deleteHtmlConfig,
};
