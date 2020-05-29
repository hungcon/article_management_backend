/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable func-names */
/* eslint-disable no-shadow */
const mongoose = require('mongoose');
// const cheerio = require('cheerio');
const {
  getAllophones,
  splitSentences,
  getAudioSentenceLink,
} = require('../../cleanText');

const { concatByLink } = require('../../audio/join_audio');

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
  return { status: 1 };
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

const syntheticArticle = async (cleanArticleId) => {
  const cleanArticle = await CleanArticle.findOne({
    _id: cleanArticleId,
  }).populate({
    path: 'sentences',
    model: Sentence,
    options: {
      sort: { sentenceId: 1 },
    },
  }).populate({
    path: 'article',
    model: Article,
  });
  const articleId = cleanArticle.article._id;
  await Article.findOneAndUpdate({ _id: articleId }, { status: 6});
  const listSentences = cleanArticle.sentences;
  for (let i = 0; i < listSentences.length; i += 1) {
    await getAudioSentenceLink(
      listSentences[i].allophones,
      cleanArticleId,
      listSentences[i].sentenceId,
      'vbee-tts-voice-hn_male_manhdung_news_48k-h',
    );
  }
  setTimeout(async function () {
    await checkCallbackAudio(listSentences.length, articleId, cleanArticleId);
  }, 2 * 60 * 1000);
  return { status: 1 };
};

const checkCallbackAudio = async (numberOfSentences,articleId, cleanArticleId) => {
  LIST_AUDIO_LINK.sort(function(a, b) {
      return a.sentenceId - b.sentenceId;
  });
  if (LIST_AUDIO_LINK.length !== numberOfSentences) {
    console.log(`Tổng hợp lỗi: ' ${cleanArticleId}`);
    await Article.findOneAndUpdate({ _id: articleId }, { status: 7});
    LIST_AUDIO_LINK= [];
    return {status: 0};
  }
  const links = [];
  for(const audioLink of LIST_AUDIO_LINK) {
    links.push(audioLink.link);
  }
  const filePath = await concatByLink({links, cleanArticleId})
  await Article.findOneAndUpdate({ _id: articleId }, { status: 8});
  await CleanArticle.findOneAndUpdate({_id: cleanArticleId}, {$set: {linkAudio: filePath}})
  LIST_AUDIO_LINK = [];
  return {status: 1};
};

module.exports = {
  getCleanArticles,
  getCleanArticleById,
  cleanArticle,
  checkNumberCallback,
  syntheticArticle,
};
