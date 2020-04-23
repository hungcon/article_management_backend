const Article = require('../../models/article');

const statistic = async (listConfig) => {
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
module.exports = {
  statistic,
};
