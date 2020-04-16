/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
const express = require('express');

const router = express.Router();
const asyncMiddleware = require('../middlewares/async');
const crawlController = require('../controllers/crawl');

router.post('/crawl/run', asyncMiddleware(crawlController.runSchedule));

module.exports = router;
