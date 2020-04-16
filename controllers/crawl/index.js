const crawlService = require('../../services/crawl');

const runSchedule = async (req, res) => {
  const status = await crawlService.runSchedule();
  res.send(status);
};
module.exports = {
  runSchedule,
};
