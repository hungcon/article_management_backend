/* eslint-disable func-names */
/* eslint-disable no-shadow */
const mongoose = require('mongoose');
// const cheerio = require('cheerio');
const { getAllophones, splitSentences } = require('../../cleanText');

const Article = require('../../../models/article');
const CleanArticle = require('../../../models/cleanArticle');
// const Loanwords = require('../../../models/loanwords');
// const Abbreviations = require('../../../models/abbreviations');
// const WordInfo = require('../../../models/wordInfo');
const Website = require('../../../models/website');
const Category = require('../../../models/category');
const Sentence = require('../../../models/sentence');

const getCleanArticles = async () => {
  let articles = await CleanArticle.find({})
    .populate({
      path: 'sentences',
      model: Sentence,
      options: {
        sort: { sentenceId: 1 },
      },
    })
    .populate({
      path: 'article',
      model: Article,
      populate: [
        {
          path: 'website',
          modal: Website,
        },
        {
          path: 'category',
          modal: Category,
        },
      ],
    });
  articles = articles.filter((article) => article.article.status === 3);
  return articles;
};

const getCleanArticleById = async (cleanArticleId) => {
  const article = await CleanArticle.findOne({ _id: cleanArticleId })
    .populate({
      path: 'sentences',
      model: Sentence,
      options: {
        sort: { sentenceId: 1 },
      },
    })
    .populate({
      path: 'article',
      model: Article,
      populate: [
        {
          path: 'website',
          modal: Website,
        },
        {
          path: 'category',
          modal: Category,
        },
      ],
    });
  return article;
};

const cleanArticle = async (articleId) => {
  const id = mongoose.Types.ObjectId(articleId);
  const article = await Article.findById(id);
  const { message } = await splitSentences(article.text);
  const listSentences = JSON.parse(message);
  const newCleanArticle = {
    article: articleId,
    sentence: [],
  };
  const cleanArticle = await CleanArticle.create(newCleanArticle);
  // store sentences
  for (let i = 0; i < listSentences.length; i += 1) {
    await getAllophones(listSentences[i], cleanArticle._id, i);
  }
  setTimeout(async function () {
    await checkNumberCallback(
      cleanArticle._id,
      articleId,
      listSentences.length,
    );
  }, 30 * 1000);
  // return {
  //   cleanArticleId: cleanArticle._id,
  //   numberOfSentences: listSentences.length,
  // };
  return { status: 1 };
};

// const replaceAllophones = async (
//   allophones,
//   wordToReplace,
//   index,
//   replaceWord,
// ) => {
//   const $ = cheerio.load(allophones, {
//     xmlMode: true,
//     decodeEntities: false,
//   });
//   const listIndex = [];
//   $('s')
//     .find('mtu')
//     .each(function (index) {
//       if (
//         $(this).get(0).attribs.nsw === 'loanword' &&
//         $(this).get(0).attribs.orig === 'covid'
//       ) {
//         listIndex.push(index);
//       }
//     });
//   const indexToReplace = listIndex[index - 1];
//   $('s')
//     .find('mtu')
//     .each(function (index) {
//       if (
//         $(this).get(0).attribs.nsw === 'loanword' &&
//         $(this).get(0).attribs.orig === 'covid' &&
//         index === indexToReplace
//       ) {
//         const tagToReplace = $(this).html();
//         const res = tagToReplace.replace(wordToReplace, replaceWord).trim();
//         $(this).children().replaceWith(res);
//       }
//     });
//   return $.html();
// };

const replaceSentence = async (id) => {
  const sentence = await Sentence.findOne({ _id: id });
  // const newAllophones = replaceAllophones(sentence.allophones);
  return sentence;
};

const checkNumberCallback = async (
  cleanArticleId,
  articleId,
  numberOfSentences,
) => {
  const cleanArticle = await CleanArticle.findOne({ _id: cleanArticleId });
  // Nếu đã lưu được số câu (số câu đã call_back về) = số câu gửi đi thì đánh dấu thành công
  if (cleanArticle.sentences.length === numberOfSentences) {
    await Article.findOneAndUpdate({ _id: articleId }, { status: 3 });
    console.log('Chuyển trạng thái thành đã chuẩn hoá máy');
  } else {
    await Sentence.deleteMany({
      _id: {
        $in: cleanArticle.sentences,
      },
    });
    await CleanArticle.findOneAndDelete({ _id: cleanArticleId });
    await Article.findOneAndUpdate({ _id: articleId }, { status: 2 });
    console.log('Chuyển trạng thái thành chuẩn hoá máy lỗi');
  }
  return { status: 1 };
};

module.exports = {
  getCleanArticles,
  getCleanArticleById,
  cleanArticle,
  replaceSentence,
  checkNumberCallback,
};
