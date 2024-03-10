const express = require("express")
const router = express.Router()
const { getCategories } = require("../controllers/categories.js")

router.get("/", getCategories)

module.exports = router





