const articleService = require('../../services/article');

const getSource = async (req, res) => {
  const text = await articleService.getText(req.query.url);
  return res.send(text);
};
const getValidArticles = async (req, res) => {
  const { website, category } = req.body;
  const articles = await articleService.getValidArticles(website, category);
  return res.send(articles);
};

const getInValidArticles = async (req, res) => {
  const { website, category } = req.body;
  const articles = await articleService.getInValidArticles(website, category);
  return res.send(articles);
};

module.exports = { getSource, getValidArticles, getInValidArticles };
