const invalidArticleService = require('../../../services/article/invalid');

const getInValidArticles = async (req, res) => {
  const { website, category, date } = req.body;
  const articles = await invalidArticleService.getInValidArticles(
    website,
    category,
    date,
  );
  return res.send(articles);
};

module.exports = {
  getInValidArticles,
};
