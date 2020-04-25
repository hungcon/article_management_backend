/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
const express = require('express');

const router = express.Router();
const asyncMiddleware = require('../middlewares/async');
const statisticController = require('../controllers/statistic');

router.post(
  '/statistic',
  asyncMiddleware(statisticController.statisticByWebsite),
);

router.post(
  '/statistic-by-type',
  asyncMiddleware(statisticController.statisticByType),
);

router.post(
  '/get-queue-length',
  asyncMiddleware(statisticController.getQueueLength),
);

module.exports = router;
