import logger from "../modules/logger.js";
import pb from "../db/pocketbase.js";

export async function login(req, res) {
  try {
    const records = await pb.collection("borrowers").getFullList({});
    console.log(records);
    res.json({ records });
  } catch (error) {
    console.log(error);
    logger.error("follow the error message: ", error);
  }
}
