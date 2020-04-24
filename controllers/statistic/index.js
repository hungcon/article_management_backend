const statisticService = require('../../services/statistic');

const statistic = async (req, res) => {
  const { listConfig } = req.body;
  const statisticResult = await statisticService.statistic(listConfig);
  return res.send({ statisticResult });
};

const getQueueLength = async (req, res) => {
  // eslint-disable-next-line no-undef
  return res.send({ queueLength: QUEUE_LINKS.length });
};

module.exports = {
  statistic,
  getQueueLength,
};
