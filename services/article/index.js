/* eslint-disable func-names */
/* eslint-disable prefer-const */
const cheerio = require('cheerio');
const Sentence = require('../../models/sentence');
const Article = require('../../models/article');

const storeAllophones = async (allophones, articleId, sentenceId) => {
  const newSentence = {
    sentenceId,
    allophones,
  };
  const sentence = await Sentence.create(newSentence);
  await Article.findOneAndUpdate(
    { _id: articleId },
    {
      $push: {
        sentences: sentence._id,
      },
    },
  );
  return { status: 1 };
};

const replaceAllophones = async (message, sentenceId, orig, type, index) => {
  const $replace = cheerio.load(message, {
    xmlMode: true,
    decodeEntities: false,
  });
  $replace('boundary').remove();
  const replaceTag = $replace('phrase').html();
  const sentence = await Sentence.findOne({ _id: sentenceId });
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
        $(this).get(0).attribs.nsw === type &&
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
        $(this).get(0).attribs.nsw === type &&
        $(this).get(0).attribs.orig.toLowerCase() === orig.toLowerCase() &&
        j === indexToReplace
      ) {
        $(this).children().remove();
        $(this).append(replaceTag.trim());
      }
    });
  await Sentence.findOneAndUpdate(
    { _id: sentenceId },
    { allophones: $.html() },
  );
  return { status: 1 };
};

module.exports = {
  storeAllophones,
  replaceAllophones,
};
