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

export async function adminLogin(req, res) {
  try {
    const authData = await pb.admins.authWithPassword(
      "belzdaniel6@gmail.com",
      "1234567891"
    );
    console.log(authData);
    res.json({ token: authData.token });
  } catch (error) {
    console.log(error);
    await errorHandler(res, error, "Failed to authenticate. try again");
  }
}
