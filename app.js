const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

dotenv.config();
const port = process.env.PORT || 8080;

const categoriesController = require("./engine/routes/category.routes");
const productsController = require("./engine/routes/product.routes");
const loansController = require("./engine/routes/loan.routes");
const authController = require("./engine/routes/auth.routes");

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.use("/api/categories", categoriesController);
app.use("/api/products", productsController);
app.use("/api/loans", loansController);
app.use("/api/auth", authController);

const db = process.env.DB;

mongoose
  .connect(db, {
    useNewUrlParser: true,
  })
  .then(() => console.log("Connected To Mongo"))
  .catch((err) => console.log(err));

app.get("", (req, res) => {
  currentDateTime = new Date();
  res.send({ dateTime: currentDateTime.toISOString() });
});

app.listen(port, () => {
  console.log(`Server running on port:${port}`);
});

module.exports = app;
