/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
const express = require('express');

const router = express.Router();
const asyncMiddleware = require('../middlewares/async');
const articleController = require('../controllers/article');

router.get('/get-source', asyncMiddleware(articleController.getSource));
router.post(
  '/add-valid-articles',
  asyncMiddleware(articleController.addValidArticle),
);

router.post(
  '/update-valid-article',
  asyncMiddleware(articleController.updateValidArticle),
);

router.post(
  '/delete-valid-article',
  asyncMiddleware(articleController.deleteValidArticle),
);

router.post(
  '/get-valid-articles',
  asyncMiddleware(articleController.getValidArticles),
);
router.post(
  '/get-valid-article-by-id',
  asyncMiddleware(articleController.getValidArticleById),
);
router.post(
  '/get-invalid-articles',
  asyncMiddleware(articleController.getInValidArticles),
);

router.post(
  '/get-clean-articles',
  asyncMiddleware(articleController.getCleanArticles),
);

router.post(
  '/get-clean-article-by-id',
  asyncMiddleware(articleController.getCleanArticleById),
);

module.exports = router;
