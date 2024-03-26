const express = require("express");
const router = express.Router();
const productService = require("../services/product.service");
const { isAdmin, isUser } = require("../middleware/auth.middleware");
const { uplaodS3 } = require("../services/s3.upload");

const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
});

router.get("/", isUser, async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (err) {
    res.status(500).send("Error reading data");
  }
});

router.get("/:category", isUser, async (req, res) => {
  try {
    const category = req.params.category;
    const products = await productService.getProductsByCategoryId(category);
    res.json(products);
  } catch (err) {
    res.status(500).send("Error reading data");
  }
});

router.post("/", isAdmin, upload.single("image"), async (req, res) => {
  try {
    const newProduct = req.body;
    const file = req.file;
    if(file){
      const url = await uplaodS3(file);
      newProduct.picture = url;
    }
    const product = await productService.createProduct(newProduct);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).send("Error adding product: " + err.message);
  }
});

router.put("/:id", isAdmin, upload.single("image"), async (req, res) => {
  try {
    const productId = req.params.id;
    const file = req.file;
    let url = ''
    if(file){
      url = await uplaodS3(file);
      req.body.picture = url;
    }
    const updateProduct = await productService.updateProduct(
      productId,
      req.body
    );
    if (updateProduct === undefined) {
      return res.status(404).send("Product not found");
    }
    res.json(updateProduct);
  } catch (err) {
    res.status(500).send("Error updating product: " + err.message);
  }
});

router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const productId = req.params.id;
    await productService.deleteProduct(productId);
    res.status(204).send();
  } catch (err) {
    res.status(500).send("Error deleting product: " + err.message);
  }
});


module.exports = router;
