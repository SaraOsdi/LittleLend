const express = require("express")
const router = express.Router()
const { createItem, updateItem, deleteItem, getItems, searchItems } = require("../controllers/items.js");

router.post("/", createItem)
router.put("/", updateItem)
router.delete("/", deleteItem)
router.get("/", getItems)
router.get("/search", searchItems) 



module.exports = router