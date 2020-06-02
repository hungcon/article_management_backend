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

const getCleanArticleByArticleId = async (req, res) => {
  const { articleId } = req.body;
  const article = await cleanArticleService.getCleanArticleByArticleId(
    articleId,
  );
  return res.send(article);
};

const cleanArticle = async (req, res) => {
  const { articleId } = req.body;
  const { status } = await cleanArticleService.cleanArticle(articleId);
  return res.send({ status });
};

const syntheticArticle = async (req, res) => {
  const { cleanArticleId } = req.body;
  const { status } = await cleanArticleService.syntheticArticle(cleanArticleId);
  return res.send({ status });
};

const normalizeWord = async (req, res) => {
  const { listExpansionChange, articleId } = req.body;
  const { status } = await cleanArticleService.normalizeWord(
    listExpansionChange,
    articleId,
  );
  return res.send({ status });
};

const finishNormalize = async (req, res) => {
  const { cleanArticleId } = req.body;
  const { status } = await cleanArticleService.finishNormalize(cleanArticleId);
  return res.send({ status });
};

module.exports = {
  getCleanArticles,
  getCleanArticleById,
  getCleanArticleByArticleId,
  cleanArticle,
  syntheticArticle,
  normalizeWord,
  finishNormalize,
};
