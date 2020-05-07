const articleService = require('../../services/article');

const getSource = async (req, res) => {
  const text = await articleService.getText(req.query.url);
  return res.send(text);
};

const addValidArticle = async (req, res) => {
  const { article } = req.body;
  const addResult = await articleService.addValidArticle(article);
  if (addResult) return res.send({ status: 1 });
  return res.send({ status: 0 });
};

const updateValidArticle = async (req, res) => {
  const { link, title, text, id } = req.body;
  const updateResult = await articleService.updateValidArticle(
    link,
    title,
    text,
    id,
  );
  if (updateResult) return res.send({ status: 1 });
  return res.send({ status: 0 });
};

const getValidArticles = async (req, res) => {
  const { website, category, date } = req.body;
  const articles = await articleService.getValidArticles(
    website,
    category,
    date,
  );
  return res.send(articles);
};

const getValidArticleById = async (req, res) => {
  const { articleId } = req.body;
  const article = await articleService.getValidArticleById(articleId);
  return res.send(article);
};

const getInValidArticles = async (req, res) => {
  const { website, category, date } = req.body;
  const articles = await articleService.getInValidArticles(
    website,
    category,
    date,
  );
  return res.send(articles);
};

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
  getSource,
  getValidArticles,
  updateValidArticle,
  getValidArticleById,
  getInValidArticles,
  addValidArticle,
  getCleanArticles,
  getCleanArticleById,
};
