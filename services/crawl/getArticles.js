const crawl = require('./crawl');

const getArticles = async (source) => {
  let articles = [];
  for (let i = 0; i < source.length; i += 1) {
    await Promise.all(
      // eslint-disable-next-line no-loop-func
      source[i].rss.map(async (rss) => {
        const listArticles = await crawl(rss, source[i].category);
        for (const article of listArticles) {
          if (sameDay(new Date(article.pubDate), new Date())) {
            articles.push(article);
          }
        }
      }),
    );
  }
  articles = articles.filter(
    (li, idx, self) =>
      self
        .map((itm) => itm.link + itm.category)
        .indexOf(li.link + li.category) === idx,
  );
  return articles;
};

function sameDay(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

module.exports = getArticles;
