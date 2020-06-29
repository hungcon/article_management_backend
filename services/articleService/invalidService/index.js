/* eslint-disable func-names */
/* eslint-disable prefer-const */
const InvalidArticle = require('../../../models/invalidArticle');
const Website = require('../../../models/website');
const Category = require('../../../models/category');

const getInValidArticles = async (website, category, date, reason) => {
  let articles;
  const condition = {};
  if (website) {
    condition.website = website;
  }
  if (category) {
    condition.category = category;
  }
  if (date.startDate) {
    condition.createdAt = {
      $gte: new Date(date.startDate).toISOString(),
      $lte: new Date(date.endDate).toISOString(),
    };
  }
  if (reason) {
    condition.reason = reason;
  }
  console.log(condition);
  articles = await InvalidArticle.find(condition)
    .populate({
      path: 'website',
      model: Website,
    })
    .populate({
      path: 'category',
      model: Category,
    });
  return articles;
};

const insertInvalidArticle = async (invalidArticle) => {
  const newInvalidArticle = await InvalidArticle.create(invalidArticle);
  return newInvalidArticle;
};

const isInvalidCategoryAdded = async (link, title, category) => {
  const article = await InvalidArticle.findOne({
    $or: [{ link }, { title }],
  });
  const listCategory = article.category;
  const isAdded = listCategory.some(
    (categoryInDb) => categoryInDb === category._id,
  );
  return isAdded;
};

const isExistedInInvalidArticle = async (link, title) => {
  const invalidArticle = await InvalidArticle.findOne({
    $or: [{ link }, { title }],
  });
  return !!invalidArticle;
};

const updateInvalidCategory = async (link, title, category) => {
  const update = await InvalidArticle.findOneAndUpdate(
    {
      $or: [{ title }, { link }],
    },
    {
      $push: { category },
    },
  );
  return update;
};

module.exports = {
  getInValidArticles,
  insertInvalidArticle,
  isInvalidCategoryAdded,
  isExistedInInvalidArticle,
  updateInvalidCategory,
};
