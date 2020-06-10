/* eslint-disable no-undef */
/* eslint-disable func-names */
/* eslint-disable prefer-const */
const axios = require('axios');
const Article = require('../../../models/article');
const InvalidArticle = require('../../../models/invalidArticle');
const Website = require('../../../models/website');
const Category = require('../../../models/category');
const Sentence = require('../../../models/sentence');
const {
  getAllophones,
  splitSentences,
  getAudioSentenceLink,
} = require('../../cleanText');

const { concatByLink } = require('../../audio/join_audio');

const getValidArticles = async (website, category, date, status) => {
  let articles;
  const condition = {};
  if (website) {
    condition.website = (await Website.findOne({ name: website }))._id;
  }
  if (category) {
    condition.category = (await Category.findOne({ name: category }))._id;
  }
  if (date.startDate) {
    condition.createdAt = {
      $gte: new Date(date.startDate).toISOString(),
      $lte: new Date(date.endDate).toISOString(),
    };
  }
  if (status) {
    condition.status = status;
  }
  console.log(condition);
  articles = await Article.find(condition)
    .populate({
      path: 'website',
      model: Website,
    })
    .populate({
      path: 'category',
      model: Category,
    });
  return articles;
};

const getValidArticleById = async (articleId) => {
  const article = await Article.findOne({ _id: articleId }).populate({
    path: 'sentences',
    model: Sentence,
    options: {
      sort: { sentenceId: 1 },
    },
  });
  return article;
};

const isCategoryAdded = async (link, title, category) => {
  const article = await Article.findOne({
    $or: [{ link }, { title }],
  });
  const listCategory = article.category;
  const isAdded = listCategory.some(
    (categoryInDb) => categoryInDb === category._id,
  );
  return isAdded;
};

const updateValidArticle = async (link, title, text, id) => {
  const updateResult = await Article.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        link,
        title,
        text,
      },
    },
  );
  return updateResult;
};

const deleteValidArticle = async (id) => {
  await Article.findOneAndDelete({ _id: id });
  return { status: 1 };
};

const updateCategory = async (link, title, category) => {
  const update = await Article.findOneAndUpdate(
    {
      $or: [{ title }, { link }],
    },
    {
      $push: { category },
    },
  );
  return update;
};

const updateStatus = async (articleId) => {
  const update = await Article.findOneAndUpdate(
    { _id: articleId },
    { $set: { status: 4 } },
  );
  return update;
};

const insertArticle = async (article) => {
  const newArticle = await Article.create(article);
  return newArticle;
};

const addValidArticle = async (article) => {
  const newArticle = await Article.create(article);
  await InvalidArticle.findOneAndDelete({
    title: article.title,
  });
  return newArticle;
};

const isExistedInArticle = async (link, title) => {
  const article = await Article.findOne({
    $or: [{ link }, { title }],
  });
  return !!article;
};

const cleanArticle = async (articleId) => {
  const article = await Article.findOne({ _id: articleId });
  const { message } = await splitSentences(article.text);
  const listSentences = JSON.parse(message);
  // save sentences
  for (let i = 0; i < listSentences.length; i += 1) {
    await getAllophones(listSentences[i], articleId, i);
  }
  setTimeout(async function () {
    await checkCallbackAllophones(articleId, listSentences.length);
  }, 2 * 60 * 1000);
  return { status: 1 };
};

const checkCallbackAllophones = async (articleId, numberOfSentences) => {
  // Nếu đã lưu được số câu (số câu đã call_back về) = số câu gửi đi thì đánh dấu thành công
  const article = await Article.findOne({ _id: articleId });
  if (article.sentences.length === numberOfSentences) {
    await Article.findOneAndUpdate({ _id: articleId }, { status: 3 });
    console.log('Chuyển trạng thái thành đã chuẩn hoá máy');
  } else {
    await Sentence.deleteMany({
      _id: {
        $in: cleanArticle.sentences,
      },
    });
    await Article.findOneAndUpdate(
      { _id: articleId },
      { status: 2, sentences: [] },
    );
    console.log('Chuyển trạng thái thành chuẩn hoá máy lỗi');
  }
  return { status: 1 };
};

const syntheticArticle = async (articleId, voiceSelect) => {
  const article = await Article.findOne({ _id: articleId }).populate({
    path: 'sentences',
    model: Sentence,
    options: {
      sort: { sentenceId: 1 },
    },
  });
  await Article.findOneAndUpdate({ _id: articleId }, { status: 6 });
  const listSentences = article.sentences;
  for (let i = 0; i < listSentences.length; i += 1) {
    await getAudioSentenceLink(
      listSentences[i].allophones,
      articleId,
      listSentences[i].sentenceId,
      voiceSelect,
    );
  }
  setTimeout(async function () {
    await checkCallbackAudio(listSentences.length, articleId);
  }, 2 * 60 * 1000);
  return { status: 1 };
};

const checkCallbackAudio = async (numberOfSentences, articleId) => {
  LIST_AUDIO_LINK.sort(function (a, b) {
    return a.sentenceId - b.sentenceId;
  });
  if (LIST_AUDIO_LINK.length !== numberOfSentences) {
    console.log(`Tổng hợp lỗi:  ${articleId}`);
    await Article.findOneAndUpdate({ _id: articleId }, { status: 7 });
    LIST_AUDIO_LINK = [];
    return { status: 0 };
  }
  const links = [];
  for (const audioLink of LIST_AUDIO_LINK) {
    links.push(audioLink.link);
  }
  const filePath = await concatByLink({ links, articleId });
  await Article.findOneAndUpdate({ _id: articleId }, { status: 8 });
  console.log('Chuyển trạng thái bài báo sang đã chuyển audio');
  await Article.findOneAndUpdate(
    { _id: articleId },
    { $set: { linkAudio: filePath } },
  );
  LIST_AUDIO_LINK = [];
  return { status: 1 };
};

const normalizeWord = async (listExpansionChange, articleId) => {
  for (const expansionChange of listExpansionChange) {
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
  await Article.findOneAndUpdate({ _id: articleId }, { $set: { status: 4 } });
  console.log('Chuyển trạng thái bài báo sang đang chuẩn hoá tay');
  return { status: 1 };
};

const finishNormalize = async (articleId) => {
  await Article.findOneAndUpdate({ _id: articleId }, { $set: { status: 5 } });
  console.log('Chuyển trạng thái bài báo sang đã chuẩn hoá tay');
  return { status: 1 };
};

module.exports = {
  getValidArticles,
  updateValidArticle,
  isCategoryAdded,
  updateStatus,
  deleteValidArticle,
  getValidArticleById,
  updateCategory,
  insertArticle,
  addValidArticle,
  isExistedInArticle,
  normalizeWord,
  syntheticArticle,
  finishNormalize,
  cleanArticle,
};
