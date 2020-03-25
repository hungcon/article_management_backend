/* eslint-disable func-names */
/* eslint-disable no-console */
const cheerio = require('cheerio');
const rp = require('request-promise');

const getText = async (url) => {
  const result = await rp(url)
    .then(function (html) {
      const $ = cheerio.load(html);
      let text;
      let content;
      if ($('article.content_detail').html() == null) {
        text = $('div.fck_detail').html();
      } else if ($('div.fck_detail').html() == null) {
        text = $('article.content_detail').html();
      } else {
        text = '';
      }
      // eslint-disable-next-line prefer-const
      content = cheerio.load(text);
      content('p.Image').remove();
      content('div.block_tinlienquan_temp').remove();
      // xoá table
      content('table.tbl_insert').remove();

      // xoá tác giả
      content('p').last().remove();
      // content('strong').remove();
      // content('em').remove();
      return content.text().replace(/\t/g, '').replace(/\n/g, '');
    })
    .catch(function (err) {
      console.log(err);
    });
  return result;
};

module.exports = { getText };
