/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
const express = require('express');

const router = express.Router();
const asyncMiddleware = require('../middlewares/async');
const configController = require('../controllers/config');

router.post('/get-configuration', asyncMiddleware(configController.getConfig));
router.post(
  '/update-article-config',
  asyncMiddleware(configController.updateArticleConfig),
);
router.post('/add-config', asyncMiddleware(configController.addConfig));
router.post('/update-config', asyncMiddleware(configController.updateConfig));
router.post('/delete-config', asyncMiddleware(configController.deleteConfig));

module.exports = router;
