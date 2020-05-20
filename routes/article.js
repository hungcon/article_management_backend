/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
const express = require('express');

const router = express.Router();
const asyncMiddleware = require('../middlewares/async');
const articleController = require('../controllers/article');

router.get('/get-source', asyncMiddleware(articleController.getSource));

router.post(
  '/split-sentences',
  asyncMiddleware(articleController.splitSentences),
);

router.post(
  '/get-allophones',
  asyncMiddleware(articleController.getAllophones),
);

router.post(
  '/replace-allophones',
  asyncMiddleware(articleController.replaceAllophones),
);

module.exports = router;
