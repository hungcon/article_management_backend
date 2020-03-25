const articleService = require('../services/article');

const getSource = async (req, res) => {
  const text = await articleService.getText(req.query.url);
  return res.send(text);
};

module.exports = { getSource };
