const configService = require('../services/config');

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

const updateRssConfig = async (req, res) => {
  await configService.updateRssConfig({
    rssConfigId: req.body.rssConfigId,
    rssConfig: req.body.rssConfig,
  });
  return res.send({ status: 1 });
};

const addRssConfig = async (req, res) => {
  await configService.addRssConfig({
    configId: req.body.configId,
    rssConfig: req.body.rssConfig,
  });
  return res.send({ status: 1 });
};

const deleteRssConfig = async (req, res) => {
  await configService.deleteRssConfig({
    configId: req.body.configId,
    rssConfigId: req.body.rssConfigId,
  });
  return res.send({ status: 1 });
};

const addHtmlConfig = async (req, res) => {
  await configService.addHtmlConfig({
    configId: req.body.configId,
    html: req.body.html,
    addBlock: req.body.addBlock,
  });
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
    configId: req.body.configId,
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
  addConfig,
  updateConfig,
  deleteConfig,
  addRssConfig,
  updateRssConfig,
  deleteRssConfig,
  addHtmlConfig,
  updateHtmlConfig,
  deleteHtmlConfig,
  addBlockConfig,
  updateBlockConfig,
  deleteBlockConfig,
};
