const validArticleService = require('../../../services/articleService/validService');

const addValidArticle = async (req, res) => {
  const { article } = req.body;
  const addResult = await validArticleService.addValidArticle(article);
  if (addResult) return res.send({ status: 1 });
  return res.send({ status: 0 });
};

const updateValidArticle = async (req, res) => {
  const { link, title, text, id } = req.body;
  const updateResult = await validArticleService.updateValidArticle(
    link,
    title,
    text,
    id,
  );
  if (updateResult) return res.send({ status: 1 });
  return res.send({ status: 0 });
};

const deleteValidArticle = async (req, res) => {
  const { id } = req.body;
  const status = await validArticleService.deleteValidArticle(id);
  return res.send(status);
};

const getValidArticles = async (req, res) => {
  const { website, category, date, status } = req.body;
  const articles = await validArticleService.getValidArticles(
    website,
    category,
    date,
    status,
  );
  return res.send(articles);
};

const getPendingArticles = async (req, res) => {
  const { website, category, date } = req.body;
  const articles = await validArticleService.getPendingArticles(
    website,
    category,
    date,
  );
  return res.send(articles);
};

const getValidArticleById = async (req, res) => {
  const { articleId } = req.body;
  const article = await validArticleService.getValidArticleById(articleId);
  return res.send(article);
};

const normalizeArticle = async (req, res) => {
  const { articleId } = req.body;
  const { status } = await validArticleService.normalizeArticle(articleId);
  return res.send({ status });
};

const syntheticArticle = async (req, res) => {
  const { articleId, voiceSelect } = req.body;
  const { status } = await validArticleService.syntheticArticle(
    articleId,
    voiceSelect,
  );
  return res.send({ status });
};

const normalizeWord = async (req, res) => {
  const { listExpansionChange, articleId } = req.body;
  const { status } = await validArticleService.normalizeWord(
    listExpansionChange,
    articleId,
  );
  return res.send({ status });
};

const finishNormalize = async (req, res) => {
  const { articleId } = req.body;
  const { status } = await validArticleService.finishNormalize(articleId);
  return res.send({ status });
};

const denyArticle = async (req, res) => {
  const { articleId } = req.body;
  const { status } = await validArticleService.denyArticle(articleId);
  return res.send({ status });
};

const updateBoundary = async (req, res) => {
  const { articleId } = req.body;
  const { status } = await validArticleService.updateBoundary(articleId);
  return res.send({ status });
};

module.exports = {
  getValidArticles,
  getPendingArticles,
  updateValidArticle,
  deleteValidArticle,
  getValidArticleById,
  addValidArticle,
  normalizeArticle,
  syntheticArticle,
  denyArticle,
  normalizeWord,
  finishNormalize,
  updateBoundary,
};
