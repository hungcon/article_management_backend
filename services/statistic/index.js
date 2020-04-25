const Article = require('../../models/article');
const { getConfiguration } = require('../config');
const InvalidArticle = require('../../models/invalidArticle');

const statisticByWebsite = async () => {
  const listConfig = await getConfiguration();
  const numberOfArticles = [];
  const listWebsiteAndCategory = [];
  listConfig.forEach((config) => {
    const websiteAndCategory = {
      website: config.website,
      category: config.category,
    };
    listWebsiteAndCategory.push(websiteAndCategory);
  });
  for (let i = 0; i < listWebsiteAndCategory.length; i += 1) {
    const num = await Article.countDocuments({
      website: listWebsiteAndCategory[i].website,
      category: listWebsiteAndCategory[i].category,
    });
    numberOfArticles.push({
      website: listWebsiteAndCategory[i].website,
      category: listWebsiteAndCategory[i].category,
      num,
    });
  }
  return numberOfArticles;
};

const statisticByType = async () => {
  const listConfig = await getConfiguration();
  const numberOfArticles = [];
  const listWebsite = [];
  listConfig.forEach((config) => {
    const website = {
      website: config.website,
    };
    if (!listWebsite.some((web) => web.website.name === website.website.name)) {
      listWebsite.push(website);
    }
  });
  for (let i = 0; i < listWebsite.length; i += 1) {
    const valid = await Article.countDocuments({
      website: listWebsite[i].website,
    });
    const invalid = await InvalidArticle.countDocuments({
      website: listWebsite[i].website,
    });
    numberOfArticles.push({
      website: listWebsite[i].website,
      valid,
      invalid,
    });
  }
  return numberOfArticles;
};

module.exports = {
  statisticByWebsite,
  statisticByType,
};
