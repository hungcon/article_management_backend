const crawlService = require('../../services/crawl');

const runSchedule = async (req, res) => {
  const status = await crawlService.runSchedule();
  res.send(status);
};

const reRunSchedule = async (req, res) => {
  const status = await crawlService.reRunSchedule();
  res.send(status);
};
module.exports = {
  reRunSchedule,
  runSchedule,
};
