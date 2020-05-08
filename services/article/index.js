/* eslint-disable prefer-const */
const mongoose = require('mongoose');
const Article = require('../../models/article');
const InvalidArticle = require('../../models/invalidArticle');
const CleanArticle = require('../../models/cleanArticle');
const Loanwords = require('../../models/loanwords');
const Abbreviations = require('../../models/abbreviations');
const WordInfo = require('../../models/wordInfo');
const Website = require('../../models/website');
const Category = require('../../models/category');
const {
  // getNormalizedText,
  getSpecialText,
  // transformText,
  parseXml,
  getXmlNormalizedText,
} = require('../cleanText');

const getValidArticles = async (website, category, date) => {
  let articles;
  let condition;
  if (!website && !category) {
    if (date.startDate === '') {
      condition = {};
    } else {
      condition = {
        createdAt: {
          $gte: new Date(date.startDate).toISOString(),
          $lte: new Date(date.endDate).toISOString(),
        },
      };
    }
  } else if (website && !category) {
    if (date.startDate === '') {
      condition = { website: (await Website.findOne({ name: website }))._id };
    } else {
      condition = {
        website: (await Website.findOne({ name: website }))._id,
        createdAt: {
          $gte: new Date(date.startDate).toISOString(),
          $lte: new Date(date.endDate).toISOString(),
        },
      };
    }
  } else if (!website && category) {
    if (date.startDate === '') {
      condition = {
        category: (await Category.findOne({ name: category }))._id,
      };
    } else {
      condition = {
        category: (await Category.findOne({ name: category }))._id,
        createdAt: {
          $gte: new Date(date.startDate).toISOString(),
          $lte: new Date(date.endDate).toISOString(),
        },
      };
    }
  } else if (date.startDate === '') {
    condition = {
      $and: [
        { website: (await Website.findOne({ name: website }))._id },
        {
          category: { $in: [(await Category.findOne({ name: category }))._id] },
        },
      ],
    };
  } else {
    condition = {
      $and: [
        { website: (await Website.findOne({ name: website }))._id },
        {
          category: { $in: [(await Category.findOne({ name: category }))._id] },
        },
      ],
      createdAt: {
        $gte: new Date(date.startDate).toISOString(),
        $lte: new Date(date.endDate).toISOString(),
      },
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

const getValidArticleById = async (articleId) => {
  const article = await Article.findOne({ _id: articleId });
  return article;
};

const getInValidArticles = async (website, category, date) => {
  let articles;
  let condition;
  if (!website && !category) {
    if (date.startDate === '') {
      condition = {};
    } else {
      condition = {
        createdAt: {
          $gte: new Date(date.startDate).toISOString(),
          $lte: new Date(date.endDate).toISOString(),
        },
      };
    }
  } else if (website && !category) {
    if (date.startDate === '') {
      condition = { website: (await Website.findOne({ name: website }))._id };
    } else {
      condition = {
        website: (await Website.findOne({ name: website }))._id,
        createdAt: {
          $gte: new Date(date.startDate).toISOString(),
          $lte: new Date(date.endDate).toISOString(),
        },
      };
    }
  } else if (!website && category) {
    if (date.startDate === '') {
      condition = {
        category: (await Category.findOne({ name: category }))._id,
      };
    } else {
      condition = {
        category: (await Category.findOne({ name: category }))._id,
        createdAt: {
          $gte: new Date(date.startDate).toISOString(),
          $lte: new Date(date.endDate).toISOString(),
        },
      };
    }
  } else if (date.startDate === '') {
    condition = {
      $and: [
        { website: (await Website.findOne({ name: website }))._id },
        {
          category: { $in: [(await Category.findOne({ name: category }))._id] },
        },
      ],
    };
  } else {
    condition = {
      $and: [
        { website: (await Website.findOne({ name: website }))._id },
        {
          category: { $in: [(await Category.findOne({ name: category }))._id] },
        },
      ],
      createdAt: {
        $gte: new Date(date.startDate).toISOString(),
        $lte: new Date(date.endDate).toISOString(),
      },
    };
  }
  console.log(condition);
  articles = await InvalidArticle.find(condition)
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

const isExistedInArticle = async (link, title) => {
  const article = await Article.findOne({
    $or: [{ link }, { title }],
  });
  return !!article;
};

const isExistedInInvalidArticle = async (link, title) => {
  const invalidArticle = await InvalidArticle.findOne({
    $or: [{ link }, { title }],
  });
  return !!invalidArticle;
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

const isInvalidCategoryAdded = async (link, title, category) => {
  const article = await InvalidArticle.findOne({
    $or: [{ link }, { title }],
  });
  const listCategory = article.category;
  const isAdded = listCategory.some(
    (categoryInDb) => categoryInDb === category._id,
  );
  return isAdded;
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

const updateInvalidCategory = async (link, title, category) => {
  const update = await InvalidArticle.findOneAndUpdate(
    {
      $or: [{ title }, { link }],
    },
    {
      $push: { category },
    },
  );
  return update;
};

const insertArticle = async (article) => {
  const newArticle = await Article.create(article);
  return newArticle;
};

const insertInvalidArticle = async (invalidArticle) => {
  const newInvalidArticle = await InvalidArticle.create(invalidArticle);
  return newInvalidArticle;
};

const addValidArticle = async (article) => {
  const newArticle = await Article.create(article);
  await InvalidArticle.findOneAndDelete({
    title: article.title,
  });
  return newArticle;
};

const cleanArticle = async (articleId) => {
  const id = mongoose.Types.ObjectId(articleId);
  const article = await Article.findById(id);
  const xml = await getXmlNormalizedText(article.text);
  if (xml === '') {
    return { status: 0 };
  }
  const cleanText = await parseXml(xml);
  const { loanwordsInfo, abbreviationsInfo } = await getSpecialText(xml);

  loanwordsInfo.forEach(async (loanword) => {
    for (
      let index = cleanText.indexOf(loanword.peopleNormalize);
      index >= 0;
      index = cleanText.indexOf(loanword.peopleNormalize, index + 1)
    ) {
      const loanwordInfo = {
        position: index,
        machineNormalize: loanword.machineNormalize,
        peopleNormalize: loanword.peopleNormalize,
      };
      loanword.normalize.push(loanwordInfo);
    }
  });

  abbreviationsInfo.forEach(async (abbreviation) => {
    for (
      let index = cleanText.indexOf(abbreviation.peopleNormalize);
      index >= 0;
      index = cleanText.indexOf(abbreviation.peopleNormalize, index + 1)
    ) {
      const abbreviationInfo = {
        position: index,
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
    cleanText,
  };
  await CleanArticle.create(newCleanArticle);
  await Article.findOneAndUpdate({ _id: id }, { isCleaned: 1 });
  return { status: 1 };
};

const getCleanArticles = async () => {
  const articles = await CleanArticle.find({})
    .populate({
      path: 'loanwords',
      model: Loanwords,
      populate: {
        path: 'normalize',
        modal: WordInfo,
      },
    })
    .populate({
      path: 'abbreviations',
      model: Abbreviations,
      populate: {
        path: 'normalize',
        modal: WordInfo,
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
      path: 'loanwords',
      model: Loanwords,
      populate: {
        path: 'normalize',
        modal: WordInfo,
      },
    })
    .populate({
      path: 'abbreviations',
      model: Abbreviations,
      populate: {
        path: 'normalize',
        modal: WordInfo,
      },
    })
    .populate({ path: 'article', model: Article });
  return article;
};
module.exports = {
  getValidArticles,
  updateValidArticle,
  deleteValidArticle,
  getValidArticleById,
  getInValidArticles,
  isExistedInArticle,
  isExistedInInvalidArticle,
  updateCategory,
  updateInvalidCategory,
  isCategoryAdded,
  isInvalidCategoryAdded,
  insertArticle,
  insertInvalidArticle,
  addValidArticle,
  cleanArticle,
  getCleanArticles,
  getCleanArticleById,
};
