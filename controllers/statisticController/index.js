const statisticService = require('../../services/statisticService');

const statisticByWebsite = async (req, res) => {
  const statisticResult = await statisticService.statisticByWebsite();
  return res.send({ statisticResult });
};

const statisticByType = async (req, res) => {
  const statisticResult = await statisticService.statisticByType();
  return res.send({ statisticResult });
};

const getQueueLength = async (req, res) => {
  // eslint-disable-next-line no-undef
  return res.send({ queueLength: QUEUE_LINKS.length });
};

module.exports = {
  statisticByWebsite,
  statisticByType,
  getQueueLength,
};
