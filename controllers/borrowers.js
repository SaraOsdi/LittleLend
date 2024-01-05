import pb from "../db/pocketbase.js";
import { errorHandler } from "../error.js";

export async function getAllBorrowers(req, res) {
  try {
    const records = await pb.collection("borrowers").getFullList({});
    console.log(records);
    res.json({ records });
  } catch (error) {
    console.log(error);
    await errorHandler(res, error, "falied to fetch the borrowers list");
  }
}
