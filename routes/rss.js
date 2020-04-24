/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
const express = require('express');

const router = express.Router();
const asyncMiddleware = require('../middlewares/async');
const authMiddleware = require('../middlewares/auth');
const rssConfigController = require('../controllers/config/rss');
// rss
router.post(
  '/add-rss-config',
  authMiddleware,
  asyncMiddleware(rssConfigController.addRssConfig),
);
router.post(
  '/update-rss-config',
  authMiddleware,
  asyncMiddleware(rssConfigController.updateRssConfig),
);
router.post(
  '/delete-rss-config',
  authMiddleware,
  asyncMiddleware(rssConfigController.deleteRssConfig),
);

module.exports = router;
