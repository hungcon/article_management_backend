/* eslint-disable func-names */
/* eslint-disable prefer-const */
const cheerio = require('cheerio');
const Article = require('../../models/article');
const CleanArticle = require('../../models/cleanArticle');
const Loanwords = require('../../models/loanwords');
const Abbreviations = require('../../models/abbreviations');
const WordInfo = require('../../models/wordInfo');
const {
  getAllophones,
  getWords,
  parseXml,
  splitSentences,
} = require('../cleanText');

const storeAllophones = async (allophones, articleId) => {
  const cleanText = await parseXml(allophones);
  const { loanwordsInfo, abbreviationsInfo } = await getWords(allophones);

  loanwordsInfo.forEach(async (loanword) => {
    let i = 0;
    for (
      let index = cleanText.indexOf(loanword.peopleNormalize);
      index >= 0;
      index = cleanText.indexOf(loanword.peopleNormalize, index + 1)
    ) {
      const loanwordInfo = {
        position: (i += 1),
        machineNormalize: loanword.machineNormalize,
        peopleNormalize: loanword.peopleNormalize,
      };
      loanword.normalize.push(loanwordInfo);
    }
  });
  abbreviationsInfo.forEach(async (abbreviation) => {
    let j = 0;
    for (
      let index = cleanText.indexOf(abbreviation.peopleNormalize);
      index >= 0;
      index = cleanText.indexOf(abbreviation.peopleNormalize, index + 1)
    ) {
      const abbreviationInfo = {
        position: (j += 1),
        machineNormalize: abbreviation.machineNormalize,
        peopleNormalize: abbreviation.peopleNormalize,
      };
      abbreviation.normalize.push(abbreviationInfo);
    }
  });

  const listLoanwordId = [];
  for (const loanwordInfo of loanwordsInfo) {
    const { normalize } = loanwordInfo;
    const loanword = {
      words: loanwordInfo.words,
      normalize: [],
    };
    for (const wordInfo of normalize) {
      const wordInfoAdded = await WordInfo.create(wordInfo);
      loanword.normalize.push(wordInfoAdded._id);
    }
    const newLoanword = await Loanwords.create(loanword);
    listLoanwordId.push(newLoanword._id);
  }

  const listAbbreviationId = [];
  for (const abbreviationInfo of abbreviationsInfo) {
    const { normalize } = abbreviationInfo;
    const abbreviation = {
      words: abbreviationInfo.words,
      normalize: [],
    };
    for (const wordInfo of normalize) {
      const wordInfoAdded = await WordInfo.create(wordInfo);
      abbreviation.normalize.push(wordInfoAdded._id);
    }
    const newAbbreviation = await Abbreviations.create(abbreviation);
    listAbbreviationId.push(newAbbreviation._id);
  }

  const newCleanArticle = {
    article: articleId,
    loanwords: listLoanwordId,
    abbreviations: listAbbreviationId,
    allophones,
    cleanText,
  };
  await CleanArticle.create(newCleanArticle);
  await Article.findOneAndUpdate({ _id: articleId }, { status: 3 });
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

const replaceAllophones = async (cleanArticleId) => {
  // eslint-disable-next-line no-shadow
  const cleanArticle = await CleanArticle.findOne({ _id: cleanArticleId });
  let $ = cheerio.load(cleanArticle.allophones, {
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
