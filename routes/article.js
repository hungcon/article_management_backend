/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
const express = require('express');

const router = express.Router();
const asyncMiddleware = require('../middlewares/async');
const articleController = require('../controllers/articleController');

router.get('/get-source', asyncMiddleware(articleController.getSource));

router.post(
  '/split-sentences',
  asyncMiddleware(articleController.splitSentences),
);

router.post(
  '/get-allophones',
  asyncMiddleware(articleController.getAllophones),
);
router.post(
  '/get-allophones-of-words',
  asyncMiddleware(articleController.getAllophonesOfWords),
);

router.post('/get-audio-url', asyncMiddleware(articleController.getAudioUrl));

router.post(
  '/replace-allophones',
  asyncMiddleware(articleController.replaceAllophones),
);

module.exports = router;
