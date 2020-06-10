/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
const express = require('express');

const router = express.Router();
const asyncMiddleware = require('../middlewares/async');
const validArticleController = require('../controllers/article/valid');

router.post(
  '/add-valid-articles',
  asyncMiddleware(validArticleController.addValidArticle),
);

router.post(
  '/update-valid-article',
  asyncMiddleware(validArticleController.updateValidArticle),
);

router.post(
  '/delete-valid-article',
  asyncMiddleware(validArticleController.deleteValidArticle),
);

router.post(
  '/get-valid-articles',
  asyncMiddleware(validArticleController.getValidArticles),
);
router.post(
  '/get-valid-article-by-id',
  asyncMiddleware(validArticleController.getValidArticleById),
);

router.post(
  '/clean-article',
  asyncMiddleware(validArticleController.cleanArticle),
);

router.post(
  '/synthetic-article',
  asyncMiddleware(validArticleController.syntheticArticle),
);

router.post(
  '/normalize-word',
  asyncMiddleware(validArticleController.normalizeWord),
);

router.post(
  '/finish-normalize',
  asyncMiddleware(validArticleController.finishNormalize),
);

module.exports = router;
