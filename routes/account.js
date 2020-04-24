/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
const express = require('express');

const router = express.Router();
const asyncMiddleware = require('../middlewares/async');
const accountController = require('../controllers/account');

router.post(
  '/create-account',
  asyncMiddleware(accountController.createAccount),
);

router.post('/sign-in', asyncMiddleware(accountController.signIn));
router.post(
  '/is-account-existed',
  asyncMiddleware(accountController.isAccountExisted),
);

module.exports = router;
