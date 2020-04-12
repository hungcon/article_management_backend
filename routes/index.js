/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
const express = require('express');

const router = express.Router();
const asyncMiddleware = require('../middlewares/async');
const articleController = require('../controllers/article');
const configController = require('../controllers/config');
/* GET home page. */
router.get('/', function (req, res, next) {
  res.json({ title: 'Express' });
});

router.get('/get-source', asyncMiddleware(articleController.getSource));
router.post('/get-configuration', asyncMiddleware(configController.getConfig));
router.post('/add-config', asyncMiddleware(configController.addConfig));
router.post('/update-config', asyncMiddleware(configController.updateConfig));
router.post('/delete-config', asyncMiddleware(configController.deleteConfig));

// rss
router.post('/add-rss-config', asyncMiddleware(configController.addRssConfig));
router.post(
  '/update-rss-config',
  asyncMiddleware(configController.updateRssConfig),
);
router.post(
  '/delete-rss-config',
  asyncMiddleware(configController.deleteRssConfig),
);
// html
router.post(
  '/add-html-config',
  asyncMiddleware(configController.addHtmlConfig),
);
router.post(
  '/update-html-config',
  asyncMiddleware(configController.updateHtmlConfig),
);
router.post(
  '/delete-html-config',
  asyncMiddleware(configController.deleteHtmlConfig),
);
// block
router.post(
  '/add-block-config',
  asyncMiddleware(configController.addBlockConfig),
);
router.post(
  '/update-block-config',
  asyncMiddleware(configController.updateBlockConfig),
);
router.post(
  '/delete-block-config',
  asyncMiddleware(configController.deleteBlockConfig),
);
module.exports = router;
