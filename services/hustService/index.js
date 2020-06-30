/* eslint-disable func-names */
/* eslint-disable no-restricted-globals */
const cheerio = require('cheerio');
const axios = require('axios');
const { extractHtml } = require('../crawlService/extract');

const getMaxPageNumber = async (url) => {
  const { data } = await axios.get(url, {
    timeout: 30 * 1000,
  });
  const $ = cheerio.load(data, { xmlMode: true, normalizeWhitespace: true });
  const $page = cheerio.load($.html($('div.pages')));
  const listPage = [];
  if ($page('a').length === 0) {
    return $page('span').text();
  }
  $page('a').each(function () {
    if (!isNaN(Number($(this).text()))) {
      listPage.push(Number($(this).text()));
    }
  });
  return Math.max(...listPage);
};

const worker = async (url) => {
  const html = [
    {
      contentRedundancySelectors: [],
      url: `https://www.hust.edu.vn/${url.substring(
        24,
      )}?p_p_id=1_WAR_portalnewspublisherportlet_INSTANCE_pIrCQOjLR74r&p_p_lifecycle=0&p_p_state=normal&p_p_mode=view&p_p_col_id=column-3&p_p_col_count=1&_1_WAR_portalnewspublisherportlet_INSTANCE_pIrCQOjLR74r_page=`,
      blocksConfiguration: [
        {
          configuration: {
            redundancySelectors: ['span'],
            itemSelector: '.news-block',
            titleSelector: 'a',
            linkSelector: 'a',
          },
          blockSelector: '.tintuc60-news',
        },
      ],
    },
  ];
  html.forEach(async (htmlConfig) => {
    const maxPageNumber = await getMaxPageNumber(url);
    let listArticles = [];
    for (let page = 1; page <= maxPageNumber; page += 1) {
      const {
        // eslint-disable-next-line no-shadow
        url,
        blocksConfiguration,
        contentRedundancySelectors,
      } = htmlConfig;
      const { error, articles } = await extractHtml(
        `${url}${page}`,
        contentRedundancySelectors,
        blocksConfiguration,
      );
      if (error) {
        console.log(error);
      }
      listArticles = [...listArticles, ...articles];
    }
    console.log(listArticles.length);
  });
};

module.exports = {
  getMaxPageNumber,
  worker,
};
