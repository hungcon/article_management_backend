/* eslint-disable prefer-const */
/* eslint-disable func-names */
/* eslint-disable no-console */
const cheerio = require('cheerio');
const axios = require('axios');
const Article = require('../../models/article');
const InvalidArticle = require('../../models/invalidArticle');

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
};
