/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
const express = require('express');

const router = express.Router();
const asyncMiddleware = require('../middlewares/async');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/role');
const accountController = require('../controllers/accountController');

router.post(
  '/create-account',
  asyncMiddleware(accountController.createAccount),
);

router.post(
  '/get-list-accounts',
  asyncMiddleware(accountController.getListAccounts),
);
router.post('/get-account', asyncMiddleware(accountController.getAccount));

router.post('/get-user-info', asyncMiddleware(accountController.getUserInfo));

router.post('/sign-in', asyncMiddleware(accountController.signIn));
router.post(
  '/is-account-existed',
  asyncMiddleware(accountController.isAccountExisted),
);

router.post(
  '/add-account',
  authMiddleware,
  roleMiddleware,
  asyncMiddleware(accountController.addAccount),
);

router.post(
  '/update-account',
  authMiddleware,
  roleMiddleware,
  asyncMiddleware(accountController.updateAccount),
);

router.post(
  '/update-password',
  authMiddleware,
  asyncMiddleware(accountController.updatePassword),
);

router.post(
  '/delete-account',
  authMiddleware,
  roleMiddleware,
  asyncMiddleware(accountController.deleteAccount),
);

module.exports = router;
