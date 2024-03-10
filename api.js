const express = require("express")
const router = express.Router()

router.use("/admin",require("./routes/admin.js"))
router.use("/categories",require("./routes/categories.js"))
router.use("/items",require("./routes/items.js"))
router.use("/lends",require("./routes/lends.js"))

module.exports = router

