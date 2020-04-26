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
  '/get-valid-articles',
  asyncMiddleware(articleController.getValidArticles),
);
router.post(
  '/get-invalid-articles',
  asyncMiddleware(articleController.getInValidArticles),
);

module.exports = router;
