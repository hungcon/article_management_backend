/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable func-names */
/* eslint-disable no-shadow */
const mongoose = require('mongoose');
// const cheerio = require('cheerio');
const axios = require('axios');
const {
  getAllophones,
  splitSentences,
  getAudioSentenceLink,
} = require('../../cleanText');

const { concatByLink } = require('../../audio/join_audio');

const Article = require('../../../models/article');
const CleanArticle = require('../../../models/cleanArticle');
const Website = require('../../../models/website');
const Category = require('../../../models/category');
const Sentence = require('../../../models/sentence');

const getCleanArticles = async () => {
  const articles = await CleanArticle.find({})
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

const getCleanArticleByArticleId = async (articleId) => {
  let articles = await CleanArticle.find({}).populate({
    path: 'article',
    model: Article,
  });
  articles = articles.filter((article) => article.article._id.toString() === articleId);
  return articles[0];
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
    await checkCallbackAllophones(
      cleanArticle._id,
      articleId,
      listSentences.length,
    );
  }, 2 * 60 * 1000);
  return { cleanArticleId:  cleanArticle._id};
};

const checkCallbackAllophones = async (
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

const syntheticArticle = async (cleanArticleId, voiceSelect) => {
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
  // Chuan hoa may loi thi da xoa cleanArticle
  if(cleanArticle === null) {
    return { status: 0 };
  }
  const articleId = cleanArticle.article._id;
  await Article.findOneAndUpdate({ _id: articleId }, { status: 6});
  const listSentences = cleanArticle.sentences;
  for (let i = 0; i < listSentences.length; i += 1) {
    await getAudioSentenceLink(
      listSentences[i].allophones,
      cleanArticleId,
      listSentences[i].sentenceId,
      voiceSelect,
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
    console.log(`Tổng hợp lỗi:  ${cleanArticleId}`);
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
  console.log("Chuyển trạng thái bài báo sang đã chuyển audio")
  await CleanArticle.findOneAndUpdate({_id: cleanArticleId}, {$set: {linkAudio: filePath}})
  LIST_AUDIO_LINK = [];
  return {status: 1};
};

const normalizeWord  = async (listExpansionChange, articleId) => {
  for(const expansionChange of listExpansionChange) {
    const { id, expansion, index, word, type } = expansionChange;
    await axios({
      method: 'POST',
      url: 'http://baonoi-tts.vbeecore.com/api/v1/tts',
      data: {
        function_call_invoke:
          'arn:aws:lambda:ap-southeast-1:279297658413:function:serverless-tts-vbee-2020-04-26-tts',
        input_text: expansion,
        rate: 1,
        voice: 'vbee-tts-voice-hn_male_manhdung_news_48k-h',
        bit_rate: '128000',
        user_id: '46030',
        app_id: '5b8776d92942cc5b459928b5',
        input_type: 'TEXT',
        request_id: 'dec0f360-959e-11ea-b171-9973230931a1',
        output_type: 'ALLOPHONES',
        call_back: `${CALLBACK_URL}/get-allophones-of-words?sentenceId=${id}&orig=${word}&type=${type}&index=${index}`,
      },
    });
  }
  await Article.findOneAndUpdate({_id: articleId}, {$set: {status: 4}});
  console.log('Chuyển trạng thái bài báo sang đang chuẩn hoá tay');
  return {status: 1}
}

const finishNormalize = async (cleanArticleId) => {
  const cleanArticle = await CleanArticle.findOne({_id: cleanArticleId}).populate({
    path: 'article',
    model: Article,
  });
  const articleId = cleanArticle.article._id;
  await Article.findOneAndUpdate({_id: articleId}, {$set: {status: 5}});
  console.log('Chuyển trạng thái bài báo sang đã chuẩn hoá tay');
  return {status: 1};
}

module.exports = {
  getCleanArticles,
  getCleanArticleById,
  getCleanArticleByArticleId,
  cleanArticle,
  checkCallbackAllophones,
  checkCallbackAudio,
  syntheticArticle,
  normalizeWord,
  finishNormalize,
};
