import pb from "../db/pocketbase.js";
import { errorHandler } from "../error.js";

export async function auth(req, res, next) {
  const { email, password } = req.body;
  try {
    await pb.admins.authWithPassword(email, password);
    next();
  } catch (error) {
    await errorHandler(res, error, "Failed to authenticate. try again");
  }
}
