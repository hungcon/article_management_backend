/* eslint-disable func-names */
/* eslint-disable prefer-const */
const { getCleanArticleByArticleId } = require('../clean/index');

const Article = require('../../../models/article');
const InvalidArticle = require('../../../models/invalidArticle');
const Website = require('../../../models/website');
const Category = require('../../../models/category');

const getValidArticles = async (website, category, date, status) => {
  let articles;
  const condition = {};
  if (website) {
    condition.website = (await Website.findOne({ name: website }))._id;
  }
  if (category) {
    condition.category = (await Category.findOne({ name: category }))._id;
  }
  if (date.startDate) {
    condition.createdAt = {
      $gte: new Date(date.startDate).toISOString(),
      $lte: new Date(date.endDate).toISOString(),
    };
  }
  if (status) {
    condition.status = status;
  }
  console.log(condition);
  articles = await Article.find(condition)
    .populate({
      path: 'website',
      model: Website,
    })
    .populate({
      path: 'category',
      model: Category,
    });
  const listArticles = [];
  for (let i = 0; i < articles.length; i += 1) {
    let article = {
      key: i,
      cleanArticleId: (
        await getCleanArticleByArticleId(articles[i]._id.toString())
      )._id,
      title: articles[i].title,
      category: articles[i].category,
      status: articles[i].status,
      website: articles[i].website,
    };
    listArticles.push(article);
  }
  return listArticles;
};

const getValidArticleById = async (articleId) => {
  const article = await Article.findOne({ _id: articleId });
  return article;
};

const isCategoryAdded = async (link, title, category) => {
  const article = await Article.findOne({
    $or: [{ link }, { title }],
  });
  const listCategory = article.category;
  const isAdded = listCategory.some(
    (categoryInDb) => categoryInDb === category._id,
  );
  return isAdded;
};

const updateValidArticle = async (link, title, text, id) => {
  const updateResult = await Article.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        link,
        title,
        text,
      },
    },
  );
  return updateResult;
};

const deleteValidArticle = async (id) => {
  await Article.findOneAndDelete({ _id: id });
  return { status: 1 };
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

const updateStatus = async (articleId) => {
  const update = await Article.findOneAndUpdate(
    { _id: articleId },
    { $set: { status: 4 } },
  );
  return update;
};

const insertArticle = async (article) => {
  const newArticle = await Article.create(article);
  return newArticle;
};

const addValidArticle = async (article) => {
  const newArticle = await Article.create(article);
  await InvalidArticle.findOneAndDelete({
    title: article.title,
  });
  return newArticle;
};

const isExistedInArticle = async (link, title) => {
  const article = await Article.findOne({
    $or: [{ link }, { title }],
  });
  return !!article;
};

module.exports = {
  getValidArticles,
  updateValidArticle,
  isCategoryAdded,
  updateStatus,
  deleteValidArticle,
  getValidArticleById,
  updateCategory,
  insertArticle,
  addValidArticle,
  isExistedInArticle,
};
