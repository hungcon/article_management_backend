const BackUp = require('../models/backup');
const Article = require('../models/article');

const checkExistInBackUp = async (title, category) => {
  // return 0 nếu chưa tồn tại trong backup
  // return 1 nếu đã tồn tại trong backup và category chưa đc thêm
  // return 2 nếu đã tồn tại trong backup và category đã đc thêm
  const article = await BackUp.findOne({ title });
  if (article == null) {
    return 0;
  }
  const listCategory = article.category;
  const checkCategory = listCategory.includes(category);
  if (!checkCategory) {
    return 1;
  }
  return 2;
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

module.exports = { checkExistInBackUp, checkExistInArticle };
