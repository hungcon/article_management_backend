/* eslint-disable no-console */
const Article = require('../../models/article');
const BackUp = require('../../models/backup');

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

const checkExistInArticle = async (title, category) => {
  // return 0 - Nếu backup rỗng ==> ko làm gì
  // return 1 - Backup có bản ghi và article rỗng => thêm mới bản ghi vào article
  // return 2 - Backup có bản ghi và article có bản ghi, category chưa đc thêm => update push category vào article
  // return 3 - Backup có bản ghi và article có bản ghi, category đã đc thêm => ko làm gì cả
  const backup = await BackUp.findOne({ title });
  const article = await Article.findOne({ title });
  if (backup == null) {
    return 0;
  }
  if (article == null) {
    return 1;
  }
  const articleCategory = article.category;
  const checkCategory = articleCategory.includes(category);
  if (!checkCategory) {
    return 2;
  }
  return 3;
};

module.exports = { addArticle, updateArticle, checkExistInArticle };