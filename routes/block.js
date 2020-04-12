/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
const express = require('express');

const router = express.Router();
const asyncMiddleware = require('../middlewares/async');
const blockConfigController = require('../controllers/config/html/block');

// block
router.post(
  '/add-block-config',
  asyncMiddleware(blockConfigController.addBlockConfig),
);
router.post(
  '/update-block-config',
  asyncMiddleware(blockConfigController.updateBlockConfig),
);
router.post(
  '/delete-block-config',
  asyncMiddleware(blockConfigController.deleteBlockConfig),
);

module.exports = router;
