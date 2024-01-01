import { config as dotenvConfig } from "dotenv";
dotenvConfig();
import cookieParser from "cookie-parser";
import express, { json as _json, urlencoded } from "express";
const app = express();
import cors from "cors";
import logger from "./modules/logger.js";
import morgan from "morgan";

const port = process.env.PORT || 3000;

app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors({ credentials: true }));
app.use(_json());
app.use(urlencoded({ extended: true }));
import apiRoutes from "./api.js";
// app.use(json());

app.use(`/api`, apiRoutes);

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});

export default app;
