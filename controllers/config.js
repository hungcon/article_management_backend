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
    configId: req.body.configId,
    htmlConfigId: req.body.htmlConfigId,
  });
  return res.send({ status: 1 });
};

const updateHtmlConfig = async (req, res) => {
  await configService.updateHtmlConfig({
    htmlId: req.body.htmlId,
    html: req.body.html,
  });
  return res.send({ status: 1 });
};

const addBlockConfig = async (req, res) => {
  await configService.addBlockConfig({
    htmlId: req.body.htmlId,
    html: req.body.html,
    block: req.body.block,
  });
  return res.send({ status: 1 });
};

const updateBlockConfig = async (req, res) => {
  await configService.updateBlockConfig({
    blockConfigId: req.body.blockConfigId,
    block: req.body.block,
  });
  return res.send({ status: 1 });
};

const deleteBlockConfig = async (req, res) => {
  await configService.deleteBlockConfig({
    htmlConfigId: req.body.htmlConfigId,
    blockConfigId: req.body.blockConfigId,
  });
  return res.send({ status: 1 });
};

module.exports = {
  getConfig,
  deleteConfig,
  updateHtmlConfig,
  deleteHtmlConfig,
  addBlockConfig,
  updateBlockConfig,
  deleteBlockConfig,
};
