/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
const express = require('express');

const router = express.Router();
const asyncMiddleware = require('../middlewares/async');
const statisticController = require('../controllers/statistic');

// block
router.post('/statistic', asyncMiddleware(statisticController.statistic));

module.exports = router;
