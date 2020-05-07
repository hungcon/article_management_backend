const Category = require('../../models/category');

const getCategorys = async () => {
  const listCategorys = await Category.find({});
  return listCategorys;
};

const addCategory = async (name) => {
  await Category.create({ name });
};

const isCategoryExisted = async (name) => {
  const category = await Category.findOne({ name });
  return category;
};

const updateCategory = async (name, categoryId) => {
  await Category.findOneAndUpdate({ _id: categoryId }, { $set: { name } });
};

const deleteCategory = async (categoryId) => {
  await Category.findByIdAndDelete(categoryId);
};
module.exports = {
  getCategorys,
  addCategory,
  updateCategory,
  isCategoryExisted,
  deleteCategory,
};
