const htmlConfigService = require('../../../services/config/html');

const addHtmlConfig = async (req, res) => {
  await htmlConfigService.addHtmlConfig({
    configId: req.body.configId,
    html: req.body.html,
    addBlock: req.body.addBlock,
  });
  return res.send({ status: 1 });
};

const deleteHtmlConfig = async (req, res) => {
  await htmlConfigService.deleteHtmlConfig({
    configId: req.body.configId,
    htmlConfigId: req.body.htmlConfigId,
  });
  return res.send({ status: 1 });
};

const updateHtmlConfig = async (req, res) => {
  await htmlConfigService.updateHtmlConfig({
    htmlId: req.body.htmlId,
    html: req.body.html,
    configId: req.body.configId,
  });
  return res.send({ status: 1 });
};

module.exports = {
  addHtmlConfig,
  updateHtmlConfig,
  deleteHtmlConfig,
};
