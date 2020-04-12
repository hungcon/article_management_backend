const blockConfigService = require('../../../../services/config/html/block');

const addBlockConfig = async (req, res) => {
  await blockConfigService.addBlockConfig({
    htmlId: req.body.htmlId,
    html: req.body.html,
    block: req.body.block,
    configId: req.body.configId,
  });
  return res.send({ status: 1 });
};

const updateBlockConfig = async (req, res) => {
  await blockConfigService.updateBlockConfig({
    blockConfigId: req.body.blockConfigId,
    block: req.body.block,
    configId: req.body.configId,
  });
  return res.send({ status: 1 });
};

const deleteBlockConfig = async (req, res) => {
  await blockConfigService.deleteBlockConfig({
    htmlConfigId: req.body.htmlConfigId,
    blockConfigId: req.body.blockConfigId,
    configId: req.body.configId,
  });
  return res.send({ status: 1 });
};

module.exports = {
  addBlockConfig,
  updateBlockConfig,
  deleteBlockConfig,
};
