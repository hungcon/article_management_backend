const categoryService = require('../../services/category');

const getCategories = async (req, res) => {
  const listCategory = await categoryService.getCategorys();
  return res.send(listCategory);
};

const isCategoryExisted = async (req, res) => {
  const { name } = req.body;
  const category = await categoryService.isCategoryExisted(name);
  return res.send(category);
};

const addCategory = async (req, res) => {
  const { name } = req.body;
  await categoryService.addCategory(name);
  return res.send({ status: 1 });
};

const updateCategory = async (req, res) => {
  const { name, categoryId } = req.body;
  await categoryService.updateCategory(name, categoryId);
  return res.send({ status: 1 });
};

const deleteCategory = async (req, res) => {
  const { categoryId } = req.body;
  await categoryService.deleteCategory(categoryId);
  return res.send({ status: 1 });
};

module.exports = {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  isCategoryExisted,
};
