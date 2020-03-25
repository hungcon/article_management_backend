const rp = require('request-promise');
const cheerio = require('cheerio');

async function getText(link) {
  const options = {
    uri: link,
    'User-Agent':
      'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
  };
  const text = rp(options).then((html) => {
    const $ = cheerio.load(html);
    let body = '';
    let content = '';
    if ($('article.content_detail').html() == null) {
      body = $('div.fck_detail').html();
    } else if ($('div.fck_detail').html() == null) {
      body = $('article.content_detail').html();
    }
    if (body == null) {
      content = cheerio.load('');
    } else {
      content = cheerio.load(body);
    }
    content('p.Image').remove();
    content('div.block_tinlienquan_temp').remove();
    // xoá table
    content('table.tbl_insert').remove();

    // xoá tác giả
    content('p').last().remove();
    // content('strong').remove();
    // content('em').remove();
    return content.text().replace(/\t/g, '').replace(/\n/g, '');
  });
  return text;
}

module.exports = getText;
