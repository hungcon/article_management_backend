const RSSConfig = require('../../../models/rssConfig');
const Configuration = require('../../../models/configuration');

const addRssConfig = async ({ configId, rssConfig }) => {
  const newRss = {
    version: 0,
    url: rssConfig.url,
    configuration: {
      itemSelector: rssConfig.itemSelector,
      titleSelector: rssConfig.titleSelector,
      linkSelector: rssConfig.linkSelector,
      sapoSelector: rssConfig.sapoSelector,
      publishDateSelector: rssConfig.publishDateSelector,
    },
  };
  // eslint-disable-next-line func-names
  await RSSConfig.create(newRss, async function (err, doc) {
    if (err) {
      console.log(err);
    }
    await Configuration.findByIdAndUpdate(configId, {
      $push: { rss: doc._id },
      $set: { updatedAt: Date.now() },
    });
  });
};

const updateRssConfig = async ({ rssConfig, rssConfigId, configId }) => {
  const update = {
    $set: {
      url: rssConfig.url,
      configuration: {
        itemSelector: rssConfig.itemSelector,
        titleSelector: rssConfig.titleSelector,
        linkSelector: rssConfig.linkSelector,
        sapoSelector: rssConfig.sapoSelector,
        publishDateSelector: rssConfig.publishDateSelector,
      },
    },
    $inc: { version: 1 },
  };
  await RSSConfig.update({ _id: rssConfigId }, update);
  await Configuration.findByIdAndUpdate(configId, {
    $set: { updatedAt: Date.now() },
  });
};

const deleteRssConfig = async ({ configId, rssConfigId }) => {
  await Configuration.findByIdAndUpdate(configId, {
    $pull: { rss: rssConfigId },
    $set: { updatedAt: Date.now() },
  });
  const config = await Configuration.findById(configId);
  if (config && config.rss.length === 0) {
    await Configuration.findByIdAndUpdate(configId, {
      $set: {
        status: '02',
      },
    });
  }
  await RSSConfig.findByIdAndDelete(rssConfigId);
};

module.exports = {
  addRssConfig,
  updateRssConfig,
  deleteRssConfig,
};
