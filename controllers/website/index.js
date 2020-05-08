const websiteService = require('../../services/website');

const getWebsites = async (req, res) => {
  const listWebsite = await websiteService.getWebsites();
  return res.send(listWebsite);
};

const findWebsiteById = async (req, res) => {
  const { websiteId } = req.body;
  const website = await websiteService.findWebsiteById(websiteId);
  return res.send(website);
};

const isWebsiteExisted = async (req, res) => {
  const { name } = req.body;
  const website = await websiteService.isWebsiteExisted(name);
  return res.send(website);
};

const addWebsite = async (req, res) => {
  const { name } = req.body;
  await websiteService.addWebsite(name);
  return res.send({ status: 1 });
};

const updateWebsite = async (req, res) => {
  const { name, websiteId } = req.body;
  await websiteService.updateWebsite(name, websiteId);
  return res.send({ status: 1 });
};

const deleteWebsite = async (req, res) => {
  const { websiteId } = req.body;
  await websiteService.deleteWebsite(websiteId);
  return res.send({ status: 1 });
};

module.exports = {
  getWebsites,
  addWebsite,
  updateWebsite,
  deleteWebsite,
  isWebsiteExisted,
  findWebsiteById,
};
