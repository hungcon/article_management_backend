const statisticService = require('../../services/statistic');

const statistic = async (req, res) => {
  const { listConfig } = req.body;
  const statisticResult = await statisticService.statistic(listConfig);
  return res.send({ statisticResult });
};

module.exports = {
  statistic,
};
