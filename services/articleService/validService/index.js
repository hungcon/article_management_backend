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
const { replaceBoundary } = require('../index');

const { concatByLink } = require('../../audioService/join_audio');

const breakTime = (time) => new Promise((resolve) => setTimeout(resolve, time));

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

const getPendingArticles = async (website, category, date) => {
  let articles;

  const condition = {
    status: 5,
  };
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
  const article = await Article.findOne({ _id: articleId }).sort({
    paragraphId: 1,
  });
  const { paragraphs } = article;
  for (const paragraph of paragraphs) {
    const { sentences } = paragraph;
    sentences.sort(function (a, b) {
      return a.sentenceId - b.sentenceId;
    });
  }
  article.paragraphs = paragraphs;
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

const normalizeArticle = async (articleId) => {
  const article = await Article.findOne({ _id: articleId });
  const { website } = article;
  const websiteInfo = await Website.findOne({ _id: website });
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
        getAllophones(
          listSentences[j],
          paragraphId,
          j,
          websiteInfo.appId,
          websiteInfo.bitRate,
        ),
      );
    }
    setTimeout(async function () {
      await checkCallbackAllophones(
        articleId,
        paragraphId,
        listSentences.length,
      );
    }, 60 * 1000);
  }
  await Promise.all(arrPromise);
  setTimeout(async function () {
    const article = await Article.findOne({ _id: articleId });
    if (article.paragraphs.length === listParagraph.length) {
      await updateBoundary(articleId);
      await Article.findOneAndUpdate({ _id: articleId }, { status: 3 });
      console.log('Chuyển trạng thái bài báo thành đã chuẩn hoá máy');
    } else {
      await Article.findOneAndUpdate(
        { _id: articleId },
        { status: 2, paragraphs: [] },
      );
      console.log('Chuyển trạng thái bài báo thành chuẩn hoá máy lỗi');
    }
  }, 90 * 1000);
  return { status: 1 };
};

const updateBoundary = async (articleId) => {
  const article = await Article.findOne({ _id: articleId });
  const { website, paragraphs } = article;
  const websiteInfo = await Website.findOne({ _id: website });
  const { titleTime, paragraphTime } = websiteInfo;
  for (let i = 0; i < paragraphs.length; i += 1) {
    const { sentences } = paragraphs[i];
    const paragraphId = paragraphs[i]._id.toString();
    await replaceBoundary(
      articleId,
      paragraphId,
      sentences.length,
      i === 0 ? titleTime : paragraphTime,
    );
    await breakTime(200);
  }
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
    console.log('xoa');
    console.log('Đoạn văn chuẩn hoá lỗi');
    return { status: 0 };
  }
  await Article.findOneAndUpdate(
    { _id: articleId },
    {
      $push: {
        paragraphs: paragraph,
      },
    },
  );
  console.log('Đoạn văn chuẩn hoá thành công');
  await Sentence.deleteMany({
    _id: {
      $in: paragraph.sentences,
    },
  });
  await Paragraph.findOneAndDelete({ _id: paragraphId });
  console.log('xoa');
  return { status: 1 };
};

const syntheticArticle = async (articleId, voiceSelect) => {
  const article = await Article.findOne({ _id: articleId });
  if (article.status === 2) {
    return { status: 0 };
  }
  const { website } = article;
  const websiteInfo = await Website.findOne({ _id: website });
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
          websiteInfo.bitRate,
          websiteInfo.appId,
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
    }, 45 * 1000);
  }
  await Promise.all(arrPromise);
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
      if (filePath === '') {
        await Article.findOneAndUpdate({ _id: articleId }, { status: 7 });
        console.log('Chuyển trạng thái bài báo sang chuyển audio lỗi');
        await Audio.deleteMany({ articleId });
      } else {
        await Article.findOneAndUpdate({ _id: articleId }, { status: 8 });
        console.log('Chuyển trạng thái bài báo sang đã chuyển audio');
        await Article.findOneAndUpdate(
          { _id: articleId },
          { $set: { linkAudio: filePath } },
        );
        await Audio.deleteMany({ articleId });
      }
    } else {
      await Article.findOneAndUpdate({ _id: articleId }, { status: 7 });
      console.log('Chuyển trạng thái bài báo sang chuyển audio lỗi');
      await Audio.deleteMany({ articleId });
    }
  }, 60 * 1000);
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
  const article = await Article.findOne({ _id: articleId });
  const { website } = article;
  const websiteInfo = await Website.findOne({ _id: website });
  for (const expansionChange of listExpansionChange) {
    const { id, expansion, index, word, wordType } = expansionChange;
    await getNormalizeWord(
      id,
      expansion,
      index,
      word,
      wordType,
      articleId,
      websiteInfo.bitRate,
      websiteInfo.appId,
    );
    await breakTime(1000);
  }
  await Article.findOneAndUpdate({ _id: articleId }, { $set: { status: 4 } });
  console.log('Chuyển trạng thái bài báo sang đang chuẩn hoá tay');
  return { status: 1 };
};

const finishNormalize = async (articleId) => {
  await Article.findOneAndUpdate({ _id: articleId }, { $set: { status: 5 } });
  console.log('Chuyển trạng thái bài báo sang đang chờ phê duyệt');
  return { status: 1 };
};

const denyArticle = async (articleId) => {
  await Article.findOneAndUpdate({ _id: articleId }, { $set: { status: 4 } });
  console.log('Chuyển trạng thái bài báo sang đang chuẩn hoá tay');
  return { status: 1 };
};
module.exports = {
  getValidArticles,
  getPendingArticles,
  denyArticle,
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
  normalizeArticle,
  updateBoundary,
};
