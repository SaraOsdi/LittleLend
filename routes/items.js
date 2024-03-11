const express = require("express")
const router = express.Router()
const { createItem, updateItem, deleteItem, getItems, searchItems } = require("../controllers/items.js");

router.post("/", createItem)
router.put("/:id", updateItem)
router.delete("/:id", deleteItem)
router.get("/", getItems)
router.get("/search", searchItems) 



module.exports = router