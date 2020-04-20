/* eslint-disable func-names */
/* eslint-disable no-console */
const cheerio = require('cheerio');
const rp = require('request-promise');
const Article = require('../../models/article');
const InvalidArticle = require('../../models/invalidArticle');

const getText = async (url) => {
  const result = await rp(url)
    .then(function (html) {
      // const article = {};
      const $ = cheerio.load(html);
      $('figure').remove();
      $('table').remove();
      // article.content = $('article.content_detail').text();
      // article.sapo = $('meta[name="description"]').attr('content');
      // return $('.fck_detail').html();
      return $('.news-content').html();
    })
    .catch(function (err) {
      console.log(err);
    });
  return result;
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
  isExistedInArticle,
  isExistedInInvalidArticle,
  updateCategory,
  isCategoryAdded,
  insertArticle,
  insertInvalidArticle,
};
