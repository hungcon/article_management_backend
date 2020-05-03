/* eslint-disable prefer-const */
/* eslint-disable func-names */
/* eslint-disable no-console */
const cheerio = require('cheerio');
const axios = require('axios');
let mongoose = require('mongoose');
const Article = require('../../models/article');
const InvalidArticle = require('../../models/invalidArticle');
const CleanArticle = require('../../models/cleanArticle');
const Loanwords = require('../../models/loanwords');
const Abbreviations = require('../../models/abbreviations');
const {
  // getNormalizedText,
  getSpecialText,
  transformText,
  parseXml,
  getXmlNormalizedText,
} = require('../cleanText');

const getText = async (url) => {
  const result = await axios.get(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1',
    },
  });
  const data = cheerio.load(result.data, { normalizeWhitespace: true });
  return data.html();
};

const getValidArticles = async (website, category, date) => {
  let articles;
  let condition;
  if (website.name === '' && category.name === '') {
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
  } else if (website.name && category.name === '') {
    if (date.startDate === '') {
      condition = { website };
    } else {
      condition = {
        website,
        createdAt: {
          $gte: new Date(date.startDate).toISOString(),
          $lte: new Date(date.endDate).toISOString(),
        },
      };
    }
  } else if (website.name === '' && category.name) {
    if (date.startDate === '') {
      condition = { category };
    } else {
      condition = {
        category,
        createdAt: {
          $gte: new Date(date.startDate).toISOString(),
          $lte: new Date(date.endDate).toISOString(),
        },
      };
    }
  } else if (date.startDate === '') {
    condition = {
      $and: [{ website }, { category: { $in: [category] } }],
    };
  } else {
    condition = {
      $and: [{ website }, { category: { $in: [category] } }],
      createdAt: {
        $gte: new Date(date.startDate).toISOString(),
        $lte: new Date(date.endDate).toISOString(),
      },
    };
  }
  console.log(condition);
  articles = await Article.find(condition);
  return articles;
};

const getInValidArticles = async (website, category, date) => {
  let articles;
  let condition;
  if (website.name === '' && category.name === '') {
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
  } else if (website.name && category.name === '') {
    if (date.startDate === '') {
      condition = { website };
    } else {
      condition = {
        website,
        createdAt: {
          $gte: new Date(date.startDate).toISOString(),
          $lte: new Date(date.endDate).toISOString(),
        },
      };
    }
  } else if (website.name === '' && category.name) {
    if (date.startDate === '') {
      condition = { category };
    } else {
      condition = {
        category,
        createdAt: {
          $gte: new Date(date.startDate).toISOString(),
          $lte: new Date(date.endDate).toISOString(),
        },
      };
    }
  } else if (date.startDate === '') {
    condition = {
      $and: [{ website }, { category: { $in: [category] } }],
    };
  } else {
    condition = {
      $and: [{ website }, { category: { $in: [category] } }],
      createdAt: {
        $gte: new Date(date.startDate).toISOString(),
        $lte: new Date(date.endDate).toISOString(),
      },
    };
  }
  console.log(condition);
  articles = await InvalidArticle.find(condition);
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
    (categoryInDb) => categoryInDb.name === category.name,
  );
  return isAdded;
};

const isInvalidCategoryAdded = async (link, title, category) => {
  const article = await InvalidArticle.findOne({
    $or: [{ link }, { title }],
  });
  const listCategory = article.category;
  const isAdded = listCategory.some(
    (categoryInDb) => categoryInDb.name === category.name,
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
  const cleanText = transformText(await parseXml(xml));
  const { loanwords, abbreviations } = await getSpecialText(xml);

  loanwords.forEach((loanword) => {
    for (
      let index = cleanText.indexOf(loanword.peopleClean);
      index >= 0;
      index = cleanText.indexOf(loanword.peopleClean, index + 1)
    ) {
      loanword.positions.push(index);
    }
  });

  abbreviations.forEach((abbreviation) => {
    for (
      let index = cleanText.indexOf(abbreviation.peopleClean);
      index >= 0;
      index = cleanText.indexOf(abbreviation.peopleClean, index + 1)
    ) {
      abbreviation.positions.push(index);
    }
  });

  const listLoanwordId = [];
  for (const loanword of loanwords) {
    const newLoanword = await Loanwords.create(loanword);
    listLoanwordId.push(newLoanword._id);
  }

  const listAbbreviationId = [];
  for (const abbreviation of abbreviations) {
    const newAbbreviation = await Abbreviations.create(abbreviation);
    listAbbreviationId.push(newAbbreviation._id);
  }
  const newCleanArticle = {
    articleId,
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
    })
    .populate({ path: 'abbreviations', model: Abbreviations })
    .populate({ path: 'articleId', model: Article });
  return articles;
};

module.exports = {
  getText,
  getValidArticles,
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
};
