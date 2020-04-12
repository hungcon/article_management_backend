/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
const express = require('express');

const router = express.Router();
const asyncMiddleware = require('../middlewares/async');
const htmlConfigController = require('../controllers/config/html');

// html
router.post(
  '/add-html-config',
  asyncMiddleware(htmlConfigController.addHtmlConfig),
);
router.post(
  '/update-html-config',
  asyncMiddleware(htmlConfigController.updateHtmlConfig),
);
router.post(
  '/delete-html-config',
  asyncMiddleware(htmlConfigController.deleteHtmlConfig),
);

module.exports = router;
