const mongoose = require('mongoose');
const { getAllophones } = require('../../cleanText');

const Article = require('../../../models/article');
const CleanArticle = require('../../../models/cleanArticle');
const Loanwords = require('../../../models/loanwords');
const Abbreviations = require('../../../models/abbreviations');
const WordInfo = require('../../../models/wordInfo');
const Website = require('../../../models/website');
const Category = require('../../../models/category');

const getCleanArticles = async () => {
  const articles = await CleanArticle.find({})
    .populate({
      path: 'loanwords',
      model: Loanwords,
      populate: {
        path: 'normalize',
        modal: WordInfo,
      },
    })
    .populate({
      path: 'abbreviations',
      model: Abbreviations,
      populate: {
        path: 'normalize',
        modal: WordInfo,
      },
    })
    .populate({
      path: 'article',
      model: Article,
      populate: [
        {
          path: 'website',
          modal: Website,
        },
        {
          path: 'category',
          modal: Category,
        },
      ],
    });
  return articles;
};

const getCleanArticleById = async (cleanArticleId) => {
  const article = await CleanArticle.findOne({ _id: cleanArticleId })
    .populate({
      path: 'loanwords',
      model: Loanwords,
      populate: {
        path: 'normalize',
        modal: WordInfo,
      },
    })
    .populate({
      path: 'abbreviations',
      model: Abbreviations,
      populate: {
        path: 'normalize',
        modal: WordInfo,
      },
    })
    .populate({ path: 'article', model: Article });
  return article;
};

const cleanArticle = async (articleId) => {
  const id = mongoose.Types.ObjectId(articleId);
  const article = await Article.findById(id);
  const allophones = await getAllophones(article.text, articleId);
  if (allophones === '') {
    await Article.findOneAndUpdate({ _id: id }, { status: 2 });
    return { status: 0 };
  }
  return { status: 1 };
};

module.exports = {
  getCleanArticles,
  getCleanArticleById,
  cleanArticle,
};
