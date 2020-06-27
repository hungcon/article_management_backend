/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
const express = require('express');

const router = express.Router();
const asyncMiddleware = require('../middlewares/async');
const authMiddleware = require('../middlewares/auth');
const crawlController = require('../controllers/crawlController');
const extractController = require('../controllers/crawlController/extract');

router.post(
  '/crawl/run',
  authMiddleware,
  asyncMiddleware(crawlController.runSchedule),
);

router.post(
  '/crawl/stop',
  authMiddleware,
  asyncMiddleware(crawlController.stopSchedule),
);

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
