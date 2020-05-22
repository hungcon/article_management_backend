/* eslint-disable func-names */
/* eslint-disable prefer-const */
const cheerio = require('cheerio');
const CleanArticle = require('../../models/cleanArticle');
// const Loanwords = require('../../models/loanwords');
// const Abbreviations = require('../../models/abbreviations');
// const WordInfo = require('../../models/wordInfo');
const Sentence = require('../../models/sentence');
const {
  getAllophones,
  // getWords,
  parseXml,
  splitSentences,
} = require('../cleanText');

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

const splitToSentences = async (text) => {
  const data = await splitSentences(text);
  const sentences = JSON.parse(data.message);
  for (let i = 0; i < sentences.length; i += 1) {
    const allophones = await getAllophones(
      sentences[i],
      '5ebf6c7266022147ac8ac9ee',
    );
    console.log(allophones);
  }
  return sentences;
};

const replaceAllophones = async (allophones) => {
  let $ = cheerio.load(allophones, {
    xmlMode: true,
    decodeEntities: false,
  });
  const listIndex = [];
  $('s')
    .find('mtu')
    .each(function (index) {
      if (
        $(this).get(0).attribs.nsw === 'loanword' &&
        $(this).get(0).attribs.orig === 'covid'
      ) {
        listIndex.push(index);
      }
    });
  const indexToReplace = listIndex[1];
  $('s')
    .find('mtu')
    .each(function (index) {
      if (
        $(this).get(0).attribs.nsw === 'loanword' &&
        $(this).get(0).attribs.orig === 'covid' &&
        index === indexToReplace
      ) {
        const tagToReplace = $(this).html();
        const res = tagToReplace.replace('cô-vít', 'hưng con').trim();
        $(this).children().replaceWith(res);
      }
    });
  return $.html();
};

module.exports = {
  storeAllophones,
  splitToSentences,
  replaceAllophones,
};
