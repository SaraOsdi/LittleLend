require("dotenv").config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const cors = require("cors");
const logger = require("./modules/logger.js");
const morgan = require("morgan");

const port = process.env.PORT || 3000;

app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors({ credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(`/api`, require(`./api.js`));

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});

module.exports = app;
