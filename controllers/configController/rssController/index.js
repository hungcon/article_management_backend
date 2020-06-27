const rssConfigService = require('../../../services/configService/rssService');
const crawlService = require('../../../services/crawlService');

const updateRssConfig = async (req, res) => {
  await rssConfigService.updateRssConfig({
    rssConfigId: req.body.rssConfigId,
    rssConfig: req.body.rssConfig,
    configId: req.body.configId,
  });
  await crawlService.reRunSchedule();
  return res.send({ status: 1 });
};

const addRssConfig = async (req, res) => {
  await rssConfigService.addRssConfig({
    configId: req.body.configId,
    rssConfig: req.body.rssConfig,
  });
  await crawlService.reRunSchedule();
  return res.send({ status: 1 });
};

const deleteRssConfig = async (req, res) => {
  await rssConfigService.deleteRssConfig({
    configId: req.body.configId,
    rssConfigId: req.body.rssConfigId,
  });
  await crawlService.reRunSchedule();
  return res.send({ status: 1 });
};

module.exports = {
  addRssConfig,
  updateRssConfig,
  deleteRssConfig,
};
