const Parser = require('rss-parser');

const parser = new Parser();

const crawl = async (rss, category) => {
  const feed = await parser.parseURL(rss);
  const listLink = [];
  feed.items.forEach((item) => {
    item.category = category;
    listLink.push(item);
  });
  return listLink;
};

module.exports = crawl;
