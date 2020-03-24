/* eslint-disable no-console */
const Article = require('../models/article');

const addArticle = async (message) => {
  const result = await Article.create(message);
  if (!result) {
    console.log('Error');
  } else {
    console.log('Article - Added');
  }
};

const updateArticle = async (message) => {
  const result = await Article.findOneAndUpdate(
    { title: message.title },
    { $push: { category: message.category } },
  ).exec();
  if (!result) {
    console.log('Error');
  } else {
    console.log('Article - Updated');
  }
};

module.exports = { addArticle, updateArticle };
