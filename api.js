import { Router } from "express";
const router = Router();
import { adminLogin } from "./controllers/login.js";
import { getAllBorrowers } from "./controllers/borrowers.js";
import { getItems, getAllItems } from "./controllers/items.js";
import { getUsers } from "./controllers/users.js";
import { auth } from "./middleware/auth.js";

router.get("/getAllBorrowers", auth, getAllBorrowers);

router.get("/getitems", getItems);

router.get("/getAllitems", auth, getAllItems);

router.post("/adminLogin", adminLogin);

router.get("/getUsers", auth, getUsers);

export default router;
