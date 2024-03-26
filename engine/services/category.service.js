const Category = require("../models/category.model");

exports.getAllCategories = async () => {
  try {
    return await Category.find({});
  } catch (error) {
    throw error;
  }
};

exports.getCategoryById = async (id) => {
  try {
    return await Category.findById(id);
  } catch (error) {
    throw error;
  }
};

exports.createCategory = async (data) => {
  const category = new Category(data);
  await category.save();
  return category;
};

exports.delete = async (id) => {
  return await Category.findByIdAndDelete(id);
};

exports.update = async (id, data) => {
  return await Category.findByIdAndUpdate(id, data, { new: true });
};
