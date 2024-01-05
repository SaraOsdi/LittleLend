import pb from "../db/pocketbase.js";
import { errorHandler } from "../error.js";

export async function getItems(req, res) {
  try {
    const records = await pb.collection("items").getFullList({
      filter: "is_available = true",
    });
    res.json({ records });
  } catch (error) {
    await errorHandler(res, error, "Failed to fetch items. follow the error");
  }
}

export async function getAllItems(req, res) {
  try {
    const records = await pb.collection("items").getFullList({});
    res.json({ records });
  } catch (error) {
    await errorHandler(res, error, "Failed to fetch items. follow the error");
  }
}
