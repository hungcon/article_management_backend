/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
const express = require('express');

const router = express.Router();
const asyncMiddleware = require('../middlewares/async');
const authMiddleware = require('../middlewares/auth');
const configController = require('../controllers/config');

router.post('/get-configuration', asyncMiddleware(configController.getConfig));
router.post(
  '/get-article-config',
  asyncMiddleware(configController.getArticleConfig),
);
router.post(
  '/update-article-config',
  authMiddleware,
  asyncMiddleware(configController.updateArticleConfig),
);
router.post(
  '/add-config',
  authMiddleware,
  asyncMiddleware(configController.addConfig),
);
router.post(
  '/update-config',
  authMiddleware,
  asyncMiddleware(configController.updateConfig),
);
router.post(
  '/delete-config',
  authMiddleware,
  asyncMiddleware(configController.deleteConfig),
);

module.exports = router;
