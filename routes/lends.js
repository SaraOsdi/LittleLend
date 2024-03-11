const express = require("express")
const router = express.Router()
const { createLend } = require("../controllers/lends.js")
const { editLend } = require("../controllers/lends.js")
const { deleteLend } = require("../controllers/lends.js")
const { getLends } = require("../controllers/lends.js")
const { searchLends } = require("../controllers/lends.js")

router.post("/", createLend)
router.put("/:id", editLend)
router.delete("/:id", deleteLend)
router.get("/", getLends)
router.get("/search", searchLends) // Use a different path for search




module.exports = router