import logger from "./modules/logger.js";

export async function errorHandler(res, error, details) {
  logger.error(details, { error });
  res.status(400).json({ message: details, error });
}
