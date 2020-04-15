/* eslint-disable func-names */
/* eslint-disable no-console */
const cheerio = require('cheerio');
const rp = require('request-promise');

const getText = async (url) => {
  const result = await rp(url)
    .then(function (html) {
      // const article = {};
      const $ = cheerio.load(html);
      $('figure').remove();
      $('table').remove();
      // article.content = $('article.content_detail').text();
      // article.sapo = $('meta[name="description"]').attr('content');
      // return $('.fck_detail').html();
      return $('.news-content').html();
    })
    .catch(function (err) {
      console.log(err);
    });
  return result;
};

module.exports = { getText };
