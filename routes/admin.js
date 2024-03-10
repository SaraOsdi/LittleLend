const express = require("express")
const router = express.Router()
const { loginAdmin } = require("../controllers/admin.js")

router.post("/", loginAdmin)

module.exports = router