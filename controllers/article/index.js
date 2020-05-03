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

const getValidArticles = async (req, res) => {
  const { website, category, date } = req.body;
  const articles = await articleService.getValidArticles(
    website,
    category,
    date,
  );
  return res.send(articles);
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

module.exports = {
  getSource,
  getValidArticles,
  getInValidArticles,
  addValidArticle,
  getCleanArticles,
};
