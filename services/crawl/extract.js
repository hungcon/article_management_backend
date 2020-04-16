/* eslint-disable func-names */
const axios = require('axios');
const cheerio = require('cheerio');

const extractOneRss = async (rssConfig) => {
  const articles = [];
  const {
    itemSelector,
    titleSelector,
    linkSelector,
    sapoSelector,
    publishDateSelector,
  } = rssConfig.configuration;
  const { url } = rssConfig;

  const { data } = await axios.get(url, {
    timeout: 30 * 1000,
  });

  const $ = cheerio.load(data, { xmlMode: true, normalizeWhitespace: true });
  $(itemSelector).each(function () {
    const title = $(this).children(titleSelector).text().trim();
    const link = $(this).children(linkSelector).text().trim();
    const sapo = $(this).children(sapoSelector).text();
    const publishDate = $(this).children(publishDateSelector).text().trim();
    articles.push({
      title,
      link,
      sapo,
      publishDate,
    });
  });
  return articles;
};

const extractAllRss = async (allRssConfig) => {
  let listArticles = [];
  await Promise.all(
    allRssConfig.map(async (rssConfig) => {
      const articles = await extractOneRss(rssConfig);
      listArticles = [...listArticles, ...articles];
    }),
  );
  return listArticles;
};

module.exports = { extractAllRss };
