/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
const express = require('express');

const router = express.Router();
const asyncMiddleware = require('../middlewares/async');
const invalidArticleController = require('../controllers/article/invalid');

router.post(
  '/get-invalid-articles',
  asyncMiddleware(invalidArticleController.getInValidArticles),
);

module.exports = router;
