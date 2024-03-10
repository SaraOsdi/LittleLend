require("dotenv").config({ path: "./.env" });
const express = require("express");
const json = require("express").json;
const cookieParser = require("cookie-parser");
const sqlite3 = require("sqlite3").verbose();
const morgan = require("morgan");
const bodyParser = require('body-parser');
const cors=require("cors");



const app = express();
app.use(cors({credentials:true}));
app.use(cookieParser());
app.use(express.json());
const PORT = 3000;

app.use(morgan("dev"));


app.use("/api", require("./api.js"))

app.use((err, req, res, next) => {
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
