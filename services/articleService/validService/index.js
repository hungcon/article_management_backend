/* eslint-disable no-loop-func */
/* eslint-disable no-shadow */
/* eslint-disable func-names */
/* eslint-disable prefer-const */
const Article = require('../../../models/article');
const Audio = require('../../../models/audio');
const InvalidArticle = require('../../../models/invalidArticle');
const Website = require('../../../models/website');
const Category = require('../../../models/category');
const Paragraph = require('../../../models/paragraph');
const Sentence = require('../../../models/sentence');

const {
  getAllophones,
  splitSentences,
  getAudioSentenceLink,
  getNormalizeWord,
} = require('../../normalizeService');

const { concatByLink } = require('../../audioService/join_audio');

const getValidArticles = async (website, category, date, status) => {
  let articles;

  const condition = {};
  if (website) {
    condition.website = website;
  }
  if (category) {
    condition.category = category;
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
    path: 'paragraphs',
    model: Paragraph,
    options: {
      sort: { paragraphId: 1 },
    },
    populate: {
      path: 'sentences',
      modal: Sentence,
      options: {
        sort: { sentenceId: 1 },
      },
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
  const { title, text } = article;
  const listParagraph = [title, ...text.split('\n\n')];
  let arrPromise = [];
  for (let i = 0; i < listParagraph.length; i += 1) {
    const paragraph = await Paragraph.create({ paragraphId: i, sentences: [] });
    const paragraphId = paragraph._id;
    const { message } = await splitSentences(listParagraph[i]);
    const listSentences = JSON.parse(message);
    for (let j = 0; j < listSentences.length; j += 1) {
      arrPromise.push(
        getAllophones(listSentences[j], articleId, paragraphId, j),
      );
    }
    setTimeout(async function () {
      await checkCallbackAllophones(
        articleId,
        paragraphId,
        listSentences.length,
      );
    }, 30 * 1000);
  }
  const res = await Promise.all(arrPromise);
  console.log('data', res);
  setTimeout(async function () {
    const article = await Article.findOne({ _id: articleId });
    if (article.paragraphs.length === listParagraph.length) {
      await Article.findOneAndUpdate({ _id: articleId }, { status: 3 });
      console.log('Chuyển trạng thái bài báo thành đã chuẩn hoá máy');
    } else {
      await Article.findOneAndUpdate({ _id: articleId }, { status: 2 });
      console.log('Chuyển trạng thái bài báo thành chuẩn hoá máy lỗi');
    }
  }, 45 * 1000);
  return { status: 1 };
};

const checkCallbackAllophones = async (
  articleId,
  paragraphId,
  numberOfSentences,
) => {
  // Nếu đã lưu được số câu (số câu đã call_back về) = số câu gửi đi thì đánh dấu doan thành công
  const paragraph = await Paragraph.findOne({ _id: paragraphId });
  if (paragraph.sentences.length !== numberOfSentences) {
    await Sentence.deleteMany({
      _id: {
        $in: paragraph.sentences,
      },
    });
    await Paragraph.findOneAndDelete({ _id: paragraphId });
    await Article.findOneAndUpdate(
      { _id: articleId },
      { status: 2, paragraphs: [] },
    );
    console.log('Đoạn văn chuẩn hoá lỗi');
    return { status: 0 };
  }
  await Article.findOneAndUpdate(
    { _id: articleId },
    {
      $push: {
        paragraphs: paragraphId,
      },
    },
  );
  console.log('Đoạn văn chuẩn hoá thành công');
  return { status: 1 };
};

const syntheticArticle = async (articleId, voiceSelect) => {
  const article = await Article.findOne({ _id: articleId }).populate({
    path: 'paragraphs',
    model: Paragraph,
    populate: {
      path: 'sentences',
      modal: Sentence,
      options: {
        sort: { sentenceId: -1 },
      },
    },
  });
  if (article.status === 2) {
    return { status: 0 };
  }
  await Article.findOneAndUpdate({ _id: articleId }, { status: 6 });
  const listParagraphs = article.paragraphs;
  let arrPromise = [];
  let syntheticSuccess = 1;
  const links = [];
  for (let i = 0; i < listParagraphs.length; i += 1) {
    const listSentences = listParagraphs[i].sentences;
    const paragraphId = listParagraphs[i]._id;
    const paragraphIndex = listParagraphs[i].paragraphId;
    for (let j = 0; j < listSentences.length; j += 1) {
      arrPromise.push(
        getAudioSentenceLink(
          listSentences[j].allophones,
          paragraphId,
          paragraphIndex,
          articleId,
          listSentences[j].sentenceId,
          voiceSelect,
        ),
      );
    }
    setTimeout(async function () {
      const { status } = await checkCallbackAudio(
        listSentences.length,
        articleId,
        paragraphId,
      );
      if (status === 0) {
        syntheticSuccess = 0;
      }
    }, 1 * 60 * 1000);
  }
  const res = await Promise.all(arrPromise);
  console.log('data', res);
  setTimeout(async function () {
    if (syntheticSuccess === 1) {
      const listAudioUrls = await Audio.find({ articleId });
      listAudioUrls.sort(function (a, b) {
        return (
          a.paragraphIndex - b.paragraphIndex || a.sentenceId - b.sentenceId
        );
      });
      for (const audioLink of listAudioUrls) {
        links.push(audioLink.link);
      }
      const filePath = await concatByLink({ links, articleId });
      await Article.findOneAndUpdate({ _id: articleId }, { status: 8 });
      console.log('Chuyển trạng thái bài báo sang đã chuyển audio');
      await Article.findOneAndUpdate(
        { _id: articleId },
        { $set: { linkAudio: filePath } },
      );
      await Audio.deleteMany({ articleId });
    } else {
      await Article.findOneAndUpdate({ _id: articleId }, { status: 7 });
      console.log('Chuyển trạng thái bài báo sang chuyển audio lỗi');
      await Audio.deleteMany({ articleId });
    }
  }, 90 * 1000);
  return { status: 1 };
};

const checkCallbackAudio = async (
  numberOfSentences,
  articleId,
  paragraphId,
) => {
  const listAudioUrl = await Audio.find({
    articleId,
    paragraphId,
  });
  if (listAudioUrl.length !== numberOfSentences) {
    console.log('Đoạn văn tổng hợp lỗi: ', paragraphId);
    return { status: 0 };
  }
  return { status: 1 };
};

const normalizeWord = async (listExpansionChange, articleId) => {
  for (const expansionChange of listExpansionChange) {
    const { id, expansion, index, word, wordType } = expansionChange;
    await getNormalizeWord(id, expansion, index, word, wordType);
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
