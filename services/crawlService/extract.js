/* eslint-disable func-names */
const axios = require('axios');
const cheerio = require('cheerio');
const { URL } = require('url');
const { getLink } = require('../../utils/link');
const { extractArticle } = require('./article');

const extractRss = async (url, configuration) => {
  try {
    const articles = [];
    const { origin } = new URL(url);
    const {
      itemSelector,
      titleSelector,
      linkSelector,
      sapoSelector,
      publicDateSelector,
    } = configuration;

    const { data } = await axios.get(url, {
      timeout: 30 * 1000,
    });

    const $ = cheerio.load(data, { xmlMode: true, normalizeWhitespace: true });
    $(itemSelector).each(function () {
      const title = $(this).children(titleSelector).text().trim();
      const link = $(this).children(linkSelector).text().trim();
      const sapo = $(this).children(sapoSelector).text();
      const publicDate = $(this).children(publicDateSelector).text().trim();
      articles.push({
        title,
        link: getLink(origin, link),
        sapo,
        publicDate,
      });
    });
    return { articles };
  } catch (error) {
    console.log(`extractRss: ${error}`);
    return { error };
  }
};

const extractHtml = async (
  url,
  contentRedundancySelectors,
  blocksConfiguration,
) => {
  try {
    const articles = [];
    const { origin } = new URL(url);
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1',
      },
      timeout: 30 * 1000,
    });
    const $ = cheerio.load(data, { normalizeWhitespace: true });
    [
      'script',
      ...contentRedundancySelectors,
    ].forEach((contentRedundancySelector) =>
      $(contentRedundancySelector).remove(),
    );
    blocksConfiguration.forEach((blockConfiguration) => {
      const {
        blockSelector,
        configuration: {
          itemSelector,
          linkSelector,
          titleSelector,
          redundancySelectors,
        },
      } = blockConfiguration;
      const $block = cheerio.load($.html($(blockSelector)));
      // remove content redundancy selectors
      redundancySelectors.forEach((redundancySelector) => {
        $block(redundancySelector).remove();
      });

      $block(itemSelector).each(function () {
        const link = $block(this).find(linkSelector).attr('href');
        const title = $block(this).find(titleSelector).text().trim();
        articles.push({
          title,
          link: getLink(origin, link),
        });
      });
    });
    return { articles };
  } catch (error) {
    console.log(`extractHtml: ${error}`);
    return { error };
  }
};

const extractMultiRss = async (multiRss) => {
  try {
    let listArticles = [];
    await Promise.all(
      multiRss.map(async (rss) => {
        const { url, configuration } = rss;
        const { error, articles } = await extractRss(url, configuration);
        if (error) {
          console.log(`extractRss: ${error}in `, url);
        }
        listArticles = [...listArticles, ...articles];
      }),
    );
    return { listArticles };
  } catch (error) {
    console.log(`extractMultiRss: ${error}`);
    return { error };
  }
};

const extractMultiHtml = async (multiHtml) => {
  try {
    let listArticles = [];
    await Promise.all(
      multiHtml.map(async (html) => {
        const { url, contentRedundancySelectors, blocksConfiguration } = html;
        const { error, articles } = await extractHtml(
          url,
          contentRedundancySelectors,
          blocksConfiguration,
        );
        if (error) {
          console.log(`extractHtml: ${error} in `, url);
        }
        listArticles = [...listArticles, ...articles];
      }),
    );
    return { listArticles };
  } catch (error) {
    console.log(`extractMultiHtml: ${error}`);
    return { error };
  }
};

const extractLinks = (type, multi) => {
  if (type === 'RSS') {
    return extractMultiRss(multi);
  }
  return extractMultiHtml(multi);
};

module.exports = {
  extractRss,
  extractHtml,
  extractLinks,
  extractArticle,
};
