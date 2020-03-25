/* eslint-disable no-console */

const {
  addArticle,
  updateArticle,
  checkExistInArticle,
} = require('../../article/action');

const saveArticles = async (message) => {
  const messageObj = JSON.parse(message.value);
  const exist = await checkExistInArticle(
    messageObj.title,
    messageObj.category,
  );
  switch (exist) {
    case 0:
      // do nothing
      break;
    case 1:
      addArticle(messageObj);
      break;
    case 2:
      updateArticle(messageObj);
      break;
    case 3:
      // do nothing
      break;
    default:
      break;
  }
};

module.exports = saveArticles;
