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

module.exports = router;
