const configService = require('../../services/config');

const getConfig = async (req, res) => {
  const config = await configService.getConfiguration();
  return res.send(config);
};

const addConfig = async (req, res) => {
  await configService.addConfig({
    general: req.body.general,
    config: req.body.config,
    article: req.body.article,
  });
  return res.send({ status: 1 });
};

const updateConfig = async (req, res) => {
  await configService.updateConfig({
    configId: req.body.configId,
    config: req.body.config,
  });
  return res.send({ status: 1 });
};

const deleteConfig = async (req, res) => {
  await configService.deleteConfig(req.body.configId);
  return res.send({ status: 1 });
};

module.exports = {
  getConfig,
  addConfig,
  updateConfig,
  deleteConfig,
};
