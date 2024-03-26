const express = require("express");
const router = express.Router();
const categoryService = require("../services/category.service");
const { isUser, isAdmin } = require("../middleware/auth.middleware");
const { uplaodS3 } = require("../services/s3.upload");
const productService = require("../services/product.service");

const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
});

router.get("", isUser, async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/:id", isUser, async (req, res) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    if (!category) {
      return res.status(404).send("Category not found");
    }
    res.json(category);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/", isAdmin, upload.single("image"), async (req, res) => {
  try {
    const newCategory = req.body;
    const file = req.file;
    if (file) {
      const url = await uplaodS3(file);
      newCategory.picture = url;
    }
    const category = await categoryService.createCategory(newCategory);
    res.status(201).json(category);
  } catch (err) {
    res.status(500).send("Error adding category: " + err.message);
  }
});

router.put("/:id", isAdmin, upload.single("image"), async (req, res) => {
  try {
    const categoryId = req.params.id;
    const file = req.file;
    let url = "";
    if (file) {
      url = await uplaodS3(file);
      req.body.picture = url;
    }
    const updateCategory = await categoryService.update(categoryId, req.body);
    if (updateCategory === undefined) {
      return res.status(404).send("category not found");
    }
    res.json(updateCategory);
  } catch (err) {
    res.status(500).send("Error updating category: " + err.message);
  }
});

router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const categoryId = req.params.id;
    await categoryService.delete(categoryId);
    await productService.deleteProductByCategoty(categoryId);
    res.status(204).send();
  } catch (err) {
    res.status(500).send("Error deleting category: " + err.message);
  }
});

module.exports = router;
