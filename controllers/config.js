const articleService = require('../services/config');

const getConfig = async (req, res) => {
  const config = await articleService.getConfiguration();
  return res.send(config);
};

module.exports = { getConfig };
