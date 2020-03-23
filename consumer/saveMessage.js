/* eslint-disable no-console */
const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost:27017/crawler', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Article = require('../model/article');
const BackUp = require('../model/backup');

const checkExist = async (title, category) => {
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

const saveMessage = async (message) => {
  const messageObj = JSON.parse(message.value);
  const exist = await checkExist(messageObj.title, messageObj.category);
  switch (exist) {
    case 0:
      // do nothing
      break;
    case 1:
      storage(messageObj);
      break;
    case 2:
      update(messageObj);
      break;
    case 3:
      // do nothing
      break;
    default:
      break;
  }
};

const storage = async (message) => {
  const result = await Article.create(message);
  if (!result) {
    console.log('Error');
  } else {
    console.log('Article - Added');
  }
};

const update = async (message) => {
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

module.exports = saveMessage;
