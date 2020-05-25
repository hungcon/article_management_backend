const cleanArticleService = require('../../../services/article/clean');

const getCleanArticles = async (req, res) => {
  const articles = await cleanArticleService.getCleanArticles();
  return res.send(articles);
};

const getCleanArticleById = async (req, res) => {
  const { cleanArticleId } = req.body;
  const article = await cleanArticleService.getCleanArticleById(cleanArticleId);
  return res.send(article);
};

const cleanArticle = async (req, res) => {
  const { articleId } = req.body;
  const {
    status,
    // cleanArticleId,
    // numberOfSentences,
  } = await cleanArticleService.cleanArticle(articleId);
  // let status;
  // eslint-disable-next-line func-names
  // setTimeout(async function () {
  //   status = await cleanArticleService.checkNumberCallback(
  //     cleanArticleId,
  //     articleId,
  //     numberOfSentences,
  //   );
  // }, 30 * 1000);
  return res.send({ status });
};

const replaceSentence = async (req, res) => {
  const { id } = req.body;
  const sentence = await cleanArticleService.replaceSentence(id);
  return res.send(sentence);
};

module.exports = {
  getCleanArticles,
  getCleanArticleById,
  cleanArticle,
  replaceSentence,
};
