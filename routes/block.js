/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
const express = require('express');

const router = express.Router();
const asyncMiddleware = require('../middlewares/async');
const authMiddleware = require('../middlewares/auth');
const blockConfigController = require('../controllers/config/html/block');

// block
router.post(
  '/add-block-config',
  authMiddleware,
  asyncMiddleware(blockConfigController.addBlockConfig),
);
router.post(
  '/update-block-config',
  authMiddleware,
  asyncMiddleware(blockConfigController.updateBlockConfig),
);
router.post(
  '/delete-block-config',
  authMiddleware,
  asyncMiddleware(blockConfigController.deleteBlockConfig),
);

module.exports = router;
