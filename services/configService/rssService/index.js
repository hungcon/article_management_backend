const mongoose = require('mongoose');
const Configuration = require('../../../models/configuration');

const addRssConfig = async ({ configId, rssConfig }) => {
  const config = await Configuration.findOne({ _id: configId });
  const listRssConfig = config.rss;
  const newRss = {
    _id: mongoose.Types.ObjectId(),
    url: rssConfig.url,
    configuration: {
      itemSelector: rssConfig.itemSelector,
      titleSelector: rssConfig.titleSelector,
      linkSelector: rssConfig.linkSelector,
      sapoSelector: rssConfig.sapoSelector,
      publicDateSelector: rssConfig.publicDateSelector,
    },
  };
  listRssConfig.push(newRss);
  await Configuration.findOneAndUpdate(
    { _id: configId },
    {
      $set: {
        rss: listRssConfig,
        updatedAt: Date.now(),
      },
    },
  );
};

const updateRssConfig = async ({ rssConfig, rssConfigId, configId }) => {
  const config = await Configuration.findOne({ _id: configId });
  const listRssConfig = config.rss;
  for (let i = 0; i < listRssConfig.length; i += 1) {
    if (listRssConfig[i]._id.toString() === rssConfigId) {
      listRssConfig[i] = {
        _id: listRssConfig[i]._id,
        url: rssConfig.url,
        configuration: {
          itemSelector: rssConfig.itemSelector,
          titleSelector: rssConfig.titleSelector,
          linkSelector: rssConfig.linkSelector,
          sapoSelector: rssConfig.sapoSelector,
          publicDateSelector: rssConfig.publicDateSelector,
        },
      };
    }
  }
  await Configuration.findOneAndUpdate(
    { _id: configId },
    {
      $set: {
        rss: listRssConfig,
        updatedAt: Date.now(),
      },
    },
  );
};

const deleteRssConfig = async ({ configId, rssConfigId }) => {
  const config = await Configuration.findOne({ _id: configId });
  let listRssConfig = config.rss;
  listRssConfig = listRssConfig.filter(
    (rss) => rss._id.toString() !== rssConfigId,
  );
  await Configuration.findOneAndUpdate(
    { _id: configId },
    {
      $set: {
        rss: listRssConfig,
        updatedAt: Date.now(),
      },
    },
  );
};

module.exports = {
  addRssConfig,
  updateRssConfig,
  deleteRssConfig,
};
