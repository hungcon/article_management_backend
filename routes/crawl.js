/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
const express = require('express');

const router = express.Router();
const asyncMiddleware = require('../middlewares/async');
const authMiddleware = require('../middlewares/auth');
const crawlController = require('../controllers/crawl');
const extractController = require('../controllers/crawl/extract');

router.post('/crawl/run', asyncMiddleware(crawlController.runSchedule));
router.post(
  '/crawl/re-run',
  authMiddleware,
  asyncMiddleware(crawlController.reRunSchedule),
);
router.post('/crawl/rss', asyncMiddleware(extractController.extractRss));
router.post('/crawl/html', asyncMiddleware(extractController.extractHtml));
router.post(
  '/crawl/article',
  asyncMiddleware(extractController.extractArticle),
);

router.post('/crawl/clean-text', asyncMiddleware(crawlController.cleanText));

module.exports = router;
