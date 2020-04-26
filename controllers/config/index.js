const configService = require('../../services/config');

const getConfig = async (req, res) => {
  const config = await configService.getConfiguration();
  return res.send(config);
};

const getConfigByWebsite = async (req, res) => {
  const { website, category } = req.body;
  const config = await configService.getConfigByWebsite(website, category);
  return res.send(config);
};

const getArticleConfig = async (req, res) => {
  const articleConfig = await configService.getArticleConfig(req.body.configId);
  return res.send(articleConfig);
};

const updateArticleConfig = async (req, res) => {
  await configService.updateArticleConfig({
    articleVal: req.body.articleVal,
    articleDemoLink: req.body.articleDemoLink,
    configId: req.body.configId,
  });
  return res.send({ status: 1 });
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
  getConfigByWebsite,
  getArticleConfig,
  updateArticleConfig,
  addConfig,
  updateConfig,
  deleteConfig,
};
