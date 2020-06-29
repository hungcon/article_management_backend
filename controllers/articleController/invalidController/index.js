const invalidArticleService = require('../../../services/articleService/invalidService');

const getInValidArticles = async (req, res) => {
  const { website, category, date, reason } = req.body;
  const articles = await invalidArticleService.getInValidArticles(
    website,
    category,
    date,
    reason,
  );
  return res.send(articles);
};

module.exports = {
  getInValidArticles,
};
