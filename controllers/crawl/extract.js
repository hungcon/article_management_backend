const crawlService = require('../../services/crawl');

const extractRss = async (req, res) => {
  const rssConfig = [
    {
      url: 'https://vnexpress.net/rss/the-gioi.rss',
      configuration: {
        itemSelector: 'item',
        titleSelector: 'title',
        linkSelector: 'link',
        sapoSelector: 'description',
        publishDateSelector: 'pubDate',
      },
    },
    {
      url: 'https://vnexpress.net/rss/the-gioi.rss',
      configuration: {
        itemSelector: 'item',
        titleSelector: 'title',
        linkSelector: 'link',
        sapoSelector: 'description',
        publishDateSelector: 'pubDate',
      },
    },
  ];
  const article = await crawlService.extractAllRss(rssConfig);
  res.send(article);
};

module.exports = {
  extractRss,
};
