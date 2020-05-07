/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
const express = require('express');

const router = express.Router();
const asyncMiddleware = require('../middlewares/async');
const authMiddleware = require('../middlewares/auth');
const categoryController = require('../controllers/category');

router.post(
  '/get-categories',
  asyncMiddleware(categoryController.getCategories),
);

router.post(
  '/add-category',
  authMiddleware,
  asyncMiddleware(categoryController.addCategory),
);

router.post(
  '/update-category',
  authMiddleware,
  asyncMiddleware(categoryController.updateCategory),
);

router.post(
  '/delete-category',
  authMiddleware,
  asyncMiddleware(categoryController.deleteCategory),
);

router.post(
  '/is-category-existed',
  asyncMiddleware(categoryController.isCategoryExisted),
);

module.exports = router;
