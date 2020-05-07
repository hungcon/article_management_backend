/* eslint-disable func-names */
/* eslint-disable prefer-const */
const axios = require('axios');
const cheerio = require('cheerio');
let { URL } = require('url');
const entities = new (require('html-entities').AllHtmlEntities)();
const { getLink } = require('../../utils/link');

function getContent($) {
  try {
    let content;
    if ($('head').children().length) {
      const { tagName } = $('head').children().get(0);
      if (tagName === 'meta') {
        content = $('head').children().eq(0).attr('content');
      } else {
        content = $('head').children().eq(0).text();
      }
    } else {
      const { tagName } = $('body').children().get(0);
      if (tagName === 'img') {
        content = $('body').children().eq(0).attr('src');
      } else {
        content = $('body').children().eq(0).text();
      }
    }
    return content;
  } catch (error) {
    // TODO: Notification, write log
    return undefined;
  }
}
const extractArticle = async (link, configuration) => {
  const {
    sapoSelector,
    sapoRedundancySelectors = [],
    titleSelector,
    titleRedundancySelectors = [],
    thumbnailSelector,
    thumbnailRedundancySelectors = [],
    tagsSelector,
    tagsRedundancySelectors = [],
    contentSelector,
    contentRedundancySelectors = [],
    textRedundancySelectors = [],
  } = configuration;

  const { data } = await axios.get(link, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1',
    },
    timeout: 30 * 1000,
  });

  const $ = cheerio.load(data, { normalizeWhitespace: true });

  //  TITLE
  let title;
  if (titleSelector && $(titleSelector).length) {
    const $title = cheerio.load($.html($(titleSelector).get(0)));
    titleRedundancySelectors.forEach((titleRedundancySelector) =>
      $title(titleRedundancySelector).remove(),
    );
    title = getContent($title);
  } else {
    const defaultTitleSelectors = ['title'];
    for (let i = 0; i < defaultTitleSelectors.length; i += 1) {
      if ($(defaultTitleSelectors[i].length)) {
        const $title = cheerio.load($.html($(defaultTitleSelectors[i])));
        const defaultTitle = getContent($title);
        if (defaultTitle) {
          title = defaultTitle;
          break;
        }
      }
    }
  }

  // SAPO
  let sapo;
  if (sapoSelector && $(sapoSelector).length) {
    const $sapo = cheerio.load($.html($(sapoSelector)));
    sapoRedundancySelectors.forEach((sapoRedundancySelector) =>
      $sapo(sapoRedundancySelector).remove(),
    );
    sapo = getContent($sapo);
  } else {
    const defaultSapoSelectors = [
      'meta[name="description"]',
      'meta[property="og:description"]',
    ];
    for (let i = 0; i < defaultSapoSelectors.length; i += 1) {
      if ($(defaultSapoSelectors[i].length)) {
        const $sapo = cheerio.load($.html($(defaultSapoSelectors[i])));
        const defaultSapo = getContent($sapo);
        if (defaultSapo) {
          sapo = defaultSapo;
          break;
        }
      }
    }
  }

  // TAGS
  let tags;
  if (tagsSelector && $(tagsSelector).length) {
    const $tags = cheerio.load($.html($(tagsSelector)));
    tagsRedundancySelectors.forEach((tagsRedundancySelector) =>
      $tags(tagsRedundancySelector).remove(),
    );
    tags = getContent($tags);
  } else {
    const defaultTagsSelectors = [
      'meta[name="new_keywords"]',
      'meta[name="keywords"]',
    ];
    for (let i = 0; i < defaultTagsSelectors.length; i += 1) {
      if ($(defaultTagsSelectors[i]).length) {
        const $tags = cheerio.load($.html($(defaultTagsSelectors[i])));
        const defaultTags = getContent($tags);
        if (defaultTags) {
          tags = defaultTags;
          break;
        }
      }
    }
  }

  // THUMBNAIL
  let thumbnail;
  const imagesSelector = $(contentSelector).find('img');
  let images = [];
  if (link) {
    const { origin } = new URL(link);
    if (thumbnailSelector) {
      const $thumbnail = cheerio.load($.html($(thumbnailSelector)));
      thumbnailRedundancySelectors.forEach((thumbnailRedundancySelector) =>
        $thumbnail(thumbnailRedundancySelector).remove(),
      );
      thumbnail = getContent($thumbnail);
      thumbnail = getLink(origin, thumbnail);
      images.push(thumbnail);
    } else {
      thumbnail = imagesSelector.length
        ? imagesSelector.eq(0).attr('src')
        : null;
      thumbnail = thumbnail ? getLink(origin, thumbnail) : undefined;
    }

    // Images
    imagesSelector.each(function () {
      const image = $(this).attr('src');
      images.push(getLink(origin, image));
    });
  }

  /* Content */
  [
    'script',
    'iframe',
    ...contentRedundancySelectors,
  ].forEach((contentRedundancySelector) =>
    $(contentRedundancySelector).remove(),
  );
  // Prevent user click link

  let content = $.html($(contentSelector)) || $.html($('body'));
  // Remove multi space by a space
  content = content.replace(/\s+/g, ' ');
  // Remove own font-family
  content = content.replace(/font-family[^";]+("|;)/g, '');
  // Remove background
  content = content.replace(/background[^";]+("|;)/g, '');

  /* Text */
  const $content = cheerio.load(content);
  textRedundancySelectors.forEach((textRedundancySelector) =>
    $content(textRedundancySelector).remove(),
  );
  $content('body')
    .find('*')
    .each(function () {
      const { tagName } = $content(this).get(0);
      switch (tagName) {
        case 'p':
        case 'br':
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
          $content(this).replaceWith(`${$(this).html()}\n\n`);
          break;
        default:
          break;
      }
    });
  const text = $content('body')
    .text()
    .trim()
    .replace(/\n+\s+\n/g, ' ')
    .replace(/\n+/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/\.\//g, '');

  const article = {
    title: title ? entities.decode(title.trim()) : undefined,
    sapo: sapo ? entities.decode(sapo.trim()) : undefined,
    tags: tags
      ? entities
          .decode(tags.trim())
          .split(/[,|\n|;]/)
          .map((tag) => tag.trim())
          .filter((tag) => tag.length)
      : undefined,
    thumbnail: thumbnail ? thumbnail.trim() : undefined,
    sourceCode: content ? entities.decode(content.trim()) : undefined,
    text: text ? entities.decode(text.trim()) : undefined,
    images,
  };

  return { article };
};

module.exports = {
  extractArticle,
};
