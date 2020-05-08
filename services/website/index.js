const Website = require('../../models/website');

const getWebsites = async () => {
  const listWebsites = await Website.find({});
  return listWebsites;
};

const findWebsiteById = async (websiteId) => {
  const website = await Website.findById(websiteId);
  return website;
};

const addWebsite = async (name) => {
  await Website.create({ name });
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
