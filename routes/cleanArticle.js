/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
const express = require('express');

const router = express.Router();
const asyncMiddleware = require('../middlewares/async');
const cleanArticleController = require('../controllers/article/clean');

router.post(
  '/get-clean-articles',
  asyncMiddleware(cleanArticleController.getCleanArticles),
);

router.post(
  '/get-clean-article-by-id',
  asyncMiddleware(cleanArticleController.getCleanArticleById),
);

router.post(
  '/clean-article',
  asyncMiddleware(cleanArticleController.cleanArticle),
);

router.post(
  '/synthetic-article',
  asyncMiddleware(cleanArticleController.syntheticArticle),
);

router.post(
  '/replace-sentence',
  asyncMiddleware(cleanArticleController.replaceSentence),
);

module.exports = router;
