const articleService = require('../../services/article');

const getAllophones = async (req, res) => {
  const { message } = req.body;
  console.log(message);
  // const { articleId } = req.query;
  // const status = await articleService.storeAllophones(message, articleId);
  // return res.send(status);
  return res.send({ status: 1 });
};

const splitSentences = async (req, res) => {
  const { text } = req.body;
  const sentences = await articleService.splitToSentences(text);
  return res.send(sentences);
};

const replaceAllophones = async (req, res) => {
  const { cleanArticleId } = req.body;
  const status = await articleService.replaceAllophones(cleanArticleId);
  return res.send(status);
};

module.exports = {
  getAllophones,
  splitSentences,
  replaceAllophones,
};
