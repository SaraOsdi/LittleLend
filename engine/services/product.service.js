const Product = require("../models/product.model");

async function createProduct(data) {
  const product = new Product(data);
  await product.save();
  return product;
}

async function getAllProducts() {
  return await Product.find();
}

async function getProductById(id) {
  return await Product.findById(id);
}

async function getProductsByCategoryId(categoryId) {
  try {
    const products = await Product.find({ category: categoryId })
      .populate({
        path: "category",
        select: "name",
      })
      .then((products) => {
        const transformedProducts = products.map((product) => ({
          id: product.id,
          name: product.name,
          categoryName: product.category.name,
          category: product.category.id,
          description: product.description,
          picture: product.picture,
          isReturnable: product.isReturnable,
          securityDepositRate: product.securityDepositRate,
          quantity: product.quantity,
          rates: product.rates
        }));

        return transformedProducts;
      });
    return products;
  } catch (error) {
    throw error;
  }
}

async function updateProduct(id, data) {
  return await Product.findByIdAndUpdate(id, data, { new: true });
}

async function deleteProduct(id) {
  return await Product.findByIdAndDelete(id);
}

async function deleteProductByCategoty(id) {
  return await Product.deleteMany({ category: id });
}

async function removeFromQuantity(id) {
  return await Product.findOneAndUpdate(
    { _id: id },
    { $inc: { quantity: -1 } },
    { new: true }
  );
}

async function updateRateProduct(id, rate) {
  const product = await Product.findOne({_id: id});
  if (!product) {
    throw new Error("Product not found");
  }
  product.rates.push(rate);
  await product.save();
}

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  getProductsByCategoryId,
  updateProduct,
  deleteProduct,
  deleteProductByCategoty,
  removeFromQuantity,
  updateRateProduct,
};
