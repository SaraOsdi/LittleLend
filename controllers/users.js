import pb from "../db/pocketbase.js";
import { errorHandler } from "../error.js";

export async function getUsers(req, res) {
  try {
    const records = await pb.collection("users").getFullList({});
    res.json({ records });
  } catch (error) {
    await errorHandler(res, error, "Failed to fetch items. follow the error");
  }
}
