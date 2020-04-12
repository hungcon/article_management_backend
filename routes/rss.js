/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
const express = require('express');

const router = express.Router();
const asyncMiddleware = require('../middlewares/async');
const rssConfigController = require('../controllers/config/rss');
// rss
router.post(
  '/add-rss-config',
  asyncMiddleware(rssConfigController.addRssConfig),
);
router.post(
  '/update-rss-config',
  asyncMiddleware(rssConfigController.updateRssConfig),
);
router.post(
  '/delete-rss-config',
  asyncMiddleware(rssConfigController.deleteRssConfig),
);

module.exports = router;
