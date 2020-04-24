/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
const express = require('express');

const router = express.Router();
const asyncMiddleware = require('../middlewares/async');
const authMiddleware = require('../middlewares/auth');
const htmlConfigController = require('../controllers/config/html');

// html
router.post(
  '/add-html-config',
  authMiddleware,
  asyncMiddleware(htmlConfigController.addHtmlConfig),
);
router.post(
  '/update-html-config',
  authMiddleware,
  asyncMiddleware(htmlConfigController.updateHtmlConfig),
);
router.post(
  '/delete-html-config',
  authMiddleware,
  asyncMiddleware(htmlConfigController.deleteHtmlConfig),
);

module.exports = router;
