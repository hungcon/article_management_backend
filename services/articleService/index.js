/* eslint-disable no-shadow */
/* eslint-disable func-names */
/* eslint-disable prefer-const */
const cheerio = require('cheerio');
const entities = new (require('html-entities').AllHtmlEntities)();
const Sentence = require('../../models/sentence');
const Paragraph = require('../../models/paragraph');
const Audio = require('../../models/audio');
const Article = require('../../models/article');

const storeAllophones = async (
  allophones,
  // articleId,
  paragraphId,
  sentenceId,
) => {
  const newSentence = {
    sentenceId,
    allophones,
  };
  const sentence = await Sentence.create(newSentence);
  await Paragraph.findOneAndUpdate(
    { _id: paragraphId },
    {
      $push: {
        // sentences: sentence._id,
        sentences: sentence,
      },
    },
  );
  return { status: 1 };
};

const replaceAllophones = async (
  message,
  sentenceId,
  orig,
  type,
  index,
  articleId,
) => {
  orig = unescape(orig);
  if (orig.includes('&')) {
    orig = orig.replace('&', entities.encode('&'));
  }
  const $replace = cheerio.load(message, {
    xmlMode: true,
    decodeEntities: false,
  });
  $replace('boundary').remove();
  const replaceTag = $replace('phrase').html();
  const article = await Article.findOne({ _id: articleId });
  const { paragraphs } = article;
  for (const paragraph of paragraphs) {
    const { sentences } = paragraph;
    for (const sentence of sentences) {
      if (sentence._id.toString() === sentenceId) {
        const { allophones } = sentence;
        const $ = cheerio.load(allophones, {
          xmlMode: true,
          decodeEntities: false,
        });
        const listIndex = [];
        $('s')
          .find('mtu')
          .each(function (i) {
            if (
              // $(this).get(0).attribs.nsw === type &&
              $(this).get(0).attribs.orig.toLowerCase() === orig.toLowerCase()
            ) {
              listIndex.push(i);
            }
          });
        const indexToReplace = listIndex[index];
        $('s')
          .find('mtu')
          .each(function (j) {
            if (
              // $(this).get(0).attribs.nsw === type &&
              $(this).get(0).attribs.orig.toLowerCase() ===
                orig.toLowerCase() &&
              j === indexToReplace
            ) {
              $(this).children().remove();
              $(this).append(replaceTag.trim());
              $(this).attr('nsw', type);
            }
          });
        sentence.allophones = $.html();
      }
    }
  }
  await Article.findOneAndUpdate(
    { _id: articleId },
    {
      $set: {
        paragraphs,
      },
    },
  );

  return { status: 1 };
};

const saveAudioUrl = async (
  link,
  paragraphId,
  paragraphIndex,
  articleId,
  sentenceId,
) => {
  const audio = {
    link,
    paragraphId,
    paragraphIndex,
    articleId,
    sentenceId,
  };
  await Audio.create(audio);
  return { status: 1 };
};

const replaceBoundary = async (
  articleId,
  paragraphId,
  paragraphLength,
  time,
) => {
  const article = await Article.findOne({ _id: articleId });
  const { paragraphs } = article;
  for (const paragraph of paragraphs) {
    const { sentences } = paragraph;
    for (const sentence of sentences) {
      if (
        sentence.sentenceId === paragraphLength - 1 &&
        paragraph._id.toString() === paragraphId
      ) {
        const { allophones } = sentence;
        const $ = cheerio.load(allophones, {
          xmlMode: true,
          decodeEntities: false,
        });
        $('boundary').attr('duration', time * 1000);
        sentence.allophones = $.html();
      }
    }
  }
  await Article.findOneAndUpdate(
    { _id: articleId },
    {
      $set: {
        paragraphs,
      },
    },
  );
  return { status: 1 };
};

module.exports = {
  storeAllophones,
  replaceAllophones,
  saveAudioUrl,
  replaceBoundary,
};
