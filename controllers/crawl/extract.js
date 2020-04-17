const extractService = require('../../services/crawl/extract');

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
module.exports = {
  extractRss,
  extractHtml,
};
