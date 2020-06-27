const Website = require('../../models/website');

const getWebsites = async () => {
  const websites = await Website.find({});
  return websites;
};

const findWebsiteById = async (websiteId) => {
  const website = await Website.findById(websiteId);
  return website;
};

const addWebsite = async (websiteInfo) => {
  await Website.create(websiteInfo);
};

const isWebsiteExisted = async (name) => {
  const website = await Website.findOne({ name });
  return website;
};

const updateWebsite = async (name, websiteId) => {
  await Website.findOneAndUpdate({ _id: websiteId }, { $set: { name } });
};

const deleteWebsite = async (websiteId) => {
  await Website.findByIdAndDelete(websiteId);
};
module.exports = {
  getWebsites,
  addWebsite,
  updateWebsite,
  isWebsiteExisted,
  deleteWebsite,
  findWebsiteById,
};
