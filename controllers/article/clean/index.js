const articleService = require('../../../services/article/clean');

const getCleanArticles = async (req, res) => {
  const articles = await articleService.getCleanArticles();
  return res.send(articles);
};

const getCleanArticleById = async (req, res) => {
  const { cleanArticleId } = req.body;
  const article = await articleService.getCleanArticleById(cleanArticleId);
  return res.send(article);
};

module.exports = {
  getCleanArticles,
  getCleanArticleById,
};
