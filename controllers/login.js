import pb from "../db/pocketbase.js";
import { errorHandler } from "../error.js";

export async function adminLogin(req, res) {
  const { email, password } = req.body;
  try {
    const authData = await pb.admins.authWithPassword(email, password);
    res.json({ authData });
  } catch (error) {
    await errorHandler(res, error, "Failed to authenticate. try again");
  }
}
