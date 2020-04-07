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
router.post('/delete-config', asyncMiddleware(configController.deleteConfig));
router.post(
  '/delete-html-config',
  asyncMiddleware(configController.deleteHtmlConfig),
);

module.exports = router;
