/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
const express = require('express');

const router = express.Router();
const asyncMiddleware = require('../middlewares/async');
const authMiddleware = require('../middlewares/auth');
const websiteController = require('../controllers/websiteController');

router.post('/get-websites', asyncMiddleware(websiteController.getWebsites));

router.post(
  '/find-website-by-id',
  asyncMiddleware(websiteController.findWebsiteById),
);

router.post(
  '/add-website',
  authMiddleware,
  asyncMiddleware(websiteController.addWebsite),
);

router.post(
  '/update-website',
  authMiddleware,
  asyncMiddleware(websiteController.updateWebsite),
);

router.post(
  '/delete-website',
  authMiddleware,
  asyncMiddleware(websiteController.deleteWebsite),
);

router.post(
  '/is-website-existed',
  asyncMiddleware(websiteController.isWebsiteExisted),
);

module.exports = router;
