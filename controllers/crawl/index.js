const crawlService = require('../../services/crawl');

const runSchedule = async (req, res) => {
  const status = await crawlService.runSchedule();
  res.send(status);
};

const stopSchedule = async (req, res) => {
  const status = await crawlService.stopSchedule();
  res.send(status);
};

const reRunSchedule = async (req, res) => {
  const status = await crawlService.reRunSchedule();
  res.send(status);
};

const cleanText = async (req, res) => {
  const { articleId } = req.body;
  const { cleanedArticle } = await crawlService.cleanText(articleId);
  res.send(cleanedArticle);
};
module.exports = {
  reRunSchedule,
  stopSchedule,
  runSchedule,
  cleanText,
};
