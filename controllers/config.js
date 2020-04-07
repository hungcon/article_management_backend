const configService = require('../services/config');

const getConfig = async (req, res) => {
  const config = await configService.getConfiguration();
  return res.send(config);
};

const deleteConfig = async (req, res) => {
  await configService.deleteConfig(req.body.configId);
  return res.send({ status: 1 });
};

const deleteHtmlConfig = async (req, res) => {
  await configService.deleteHtmlConfig({
    htmlConfigId: req.body.htmlConfigId,
    index: req.body.index,
  });
  return res.send({ status: 1 });
};

module.exports = { getConfig, deleteConfig, deleteHtmlConfig };
