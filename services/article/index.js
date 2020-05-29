/* eslint-disable func-names */
/* eslint-disable prefer-const */
const cheerio = require('cheerio');
const CleanArticle = require('../../models/cleanArticle');
// const Loanwords = require('../../models/loanwords');
// const Abbreviations = require('../../models/abbreviations');
// const WordInfo = require('../../models/wordInfo');
const Sentence = require('../../models/sentence');
const { parseXml } = require('../cleanText');

const storeAllophones = async (allophones, cleanArticleId, sentenceId) => {
  const cleanText = await parseXml(allophones);
  const newSentence = {
    sentenceId,
    allophones,
    text: cleanText,
  };
  const sentence = await Sentence.create(newSentence);
  await CleanArticle.findOneAndUpdate(
    { _id: cleanArticleId },
    {
      $push: {
        sentences: sentence._id,
      },
    },
  );
  return { status: 1 };
};

const replaceAllophones = async (message, sentenceId, position, orig, type) => {
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
    .each(function (index) {
      if (
        $(this).get(0).attribs.nsw === type &&
        $(this).get(0).attribs.orig.toLowerCase() === orig.toLowerCase()
      ) {
        listIndex.push(index);
      }
    });
  const indexToReplace = listIndex[position - 1];
  $('s')
    .find('mtu')
    .each(function (index) {
      if (
        $(this).get(0).attribs.nsw === type &&
        $(this).get(0).attribs.orig.toLowerCase() === orig.toLowerCase() &&
        index === indexToReplace
      ) {
        $(this).children().remove();
        $(this).append(replaceTag.trim());
      }
    });
  await Sentence.findOneAndUpdate(
    { _id: sentenceId },
    { allophones: $.html(), text: await parseXml($.html()) },
  );
  return { status: 1 };
};

module.exports = {
  storeAllophones,
  replaceAllophones,
};
