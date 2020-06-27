const extractService = require('../../services/crawlService/extract');

const extractRss = async (req, res) => {
  const { url, configuration } = req.body;
  const { error, articles } = await extractService.extractRss(
    url,
    configuration,
  );
  if (error) {
    return res.send(error);
  }
  return res.send(articles);
};

const extractHtml = async (req, res) => {
  const { url, contentRedundancySelectors, blocksConfiguration } = req.body;
  const { error, articles } = await extractService.extractHtml(
    url,
    contentRedundancySelectors,
    blocksConfiguration,
  );
  if (error) {
    return res.send(error);
  }
  return res.send(articles);
};

const extractArticle = async (req, res) => {
  const { link, configuration } = req.body;
  const { error, article } = await extractService.extractArticle(
    link,
    configuration,
  );
  if (error) {
    return res.send(error);
  }
  return res.send(article);
};

module.exports = {
  extractRss,
  extractHtml,
  extractArticle,
};
