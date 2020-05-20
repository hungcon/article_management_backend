const validArticleService = require('../../../services/article/valid');

const addValidArticle = async (req, res) => {
  const { article } = req.body;
  const addResult = await validArticleService.addValidArticle(article);
  if (addResult) return res.send({ status: 1 });
  return res.send({ status: 0 });
};

const updateValidArticle = async (req, res) => {
  const { link, title, text, id } = req.body;
  const updateResult = await validArticleService.updateValidArticle(
    link,
    title,
    text,
    id,
  );
  if (updateResult) return res.send({ status: 1 });
  return res.send({ status: 0 });
};

const deleteValidArticle = async (req, res) => {
  const { id } = req.body;
  const status = await validArticleService.deleteValidArticle(id);
  return res.send(status);
};

const getValidArticles = async (req, res) => {
  const { website, category, date, status } = req.body;
  const articles = await validArticleService.getValidArticles(
    website,
    category,
    date,
    status,
  );
  return res.send(articles);
};

const getValidArticleById = async (req, res) => {
  const { articleId } = req.body;
  const article = await validArticleService.getValidArticleById(articleId);
  return res.send(article);
};

module.exports = {
  getValidArticles,
  updateValidArticle,
  deleteValidArticle,
  getValidArticleById,
  addValidArticle,
};
