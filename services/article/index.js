/* eslint-disable func-names */
/* eslint-disable no-console */
const cheerio = require('cheerio');
const axios = require('axios');
const Article = require('../../models/article');
const InvalidArticle = require('../../models/invalidArticle');

const getText = async (url) => {
  const result = await axios.get(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1',
    },
  });
  const data = cheerio.load(result.data, { normalizeWhitespace: true });
  return data.html();
};

const getValidArticles = async (website, category) => {
  if (website.name === '' && category.name === '') {
    const articles = await Article.find({});
    return articles;
  }
  if (website.name && category.name === '') {
    const articles = await Article.find({ website });
    return articles;
  }
  if (website.name === '' && category.name) {
    const articles = await Article.find({ category });
    return articles;
  }
  const articles = await Article.find({
    $and: [{ website }, { category: { $in: [category] } }],
  });
  return articles;
};

const getInValidArticles = async (website, category) => {
  if (website.name === '' && category.name === '') {
    const articles = await InvalidArticle.find({});
    return articles;
  }
  if (website.name && category.name === '') {
    const articles = await InvalidArticle.find({ website });
    return articles;
  }
  if (website.name === '' && category.name) {
    const articles = await InvalidArticle.find({ category });
    return articles;
  }
  const articles = await InvalidArticle.find({
    $and: [{ website }, { category: { $in: [category] } }],
  });
  return articles;
};

const isExistedInArticle = async (link, title) => {
  const article = await Article.findOne({
    $or: [{ link }, { title }],
  });
  return !!article;
};

const isExistedInInvalidArticle = async (link, title) => {
  const invalidArticle = await InvalidArticle.findOne({
    $or: [{ link }, { title }],
  });
  return !!invalidArticle;
};

const isCategoryAdded = async (link, title, category) => {
  const article = await Article.findOne({
    $or: [{ link }, { title }],
  });
  const listCategory = article.category;
  const isAdded = listCategory.some(
    (categoryInDb) => categoryInDb.name === category.name,
  );
  return isAdded;
};

const updateCategory = async (link, title, category) => {
  const update = await Article.findOneAndUpdate(
    {
      $or: [{ title }, { link }],
    },
    {
      $push: { category },
    },
  );
  return update;
};

const insertArticle = async (article) => {
  const newArticle = await Article.create(article);
  return newArticle;
};

const insertInvalidArticle = async (invalidArticle) => {
  const newInvalidArticle = await InvalidArticle.create(invalidArticle);
  return newInvalidArticle;
};
module.exports = {
  getText,
  getValidArticles,
  getInValidArticles,
  isExistedInArticle,
  isExistedInInvalidArticle,
  updateCategory,
  isCategoryAdded,
  insertArticle,
  insertInvalidArticle,
};
