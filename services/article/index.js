/* eslint-disable func-names */
/* eslint-disable prefer-const */
const cheerio = require('cheerio');
const Sentence = require('../../models/sentence');
const Paragraph = require('../../models/paragraph');
// const Article = require('../../models/article');
const Audio = require('../../models/audio');

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
        $(this).get(0).attribs.orig.toLowerCase() === orig.toLowerCase() &&
        j === indexToReplace
      ) {
        $(this).children().remove();
        $(this).append(replaceTag.trim());
        $(this).attr('nsw', type);
      }
    });
  await Sentence.findOneAndUpdate(
    { _id: sentenceId },
    { allophones: $.html() },
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

module.exports = {
  storeAllophones,
  replaceAllophones,
  saveAudioUrl,
};
