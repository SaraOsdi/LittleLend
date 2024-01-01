import { Router } from "express";
const router = Router();
import { login } from "./controllers/auth.js";

router.get("/login", login);

// take all those routes and out them like i did in the login route. i know
// it needs to be post so you can check if a user is in the system or not,
// but i will handle this tommorow evening. more details in the email

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/", (req, res) => {
  res.send("Hello, this is the home page!");
});

router.get("/api/items", (req, res) => {
  // Check if the request is coming from an authenticated admin
  if (req.isAuthenticated() && req.user.isAdmin) {
    // Admin view: retrieve all items
    db.all("SELECT * FROM items", (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ items: rows });
    });
  } else {
    // User view: retrieve only available items
    db.all("SELECT * FROM items WHERE is_available = 1", (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ items: rows });
    });
  }
});

router.get("/users", (req, res) => {
  db.all("SELECT * FROM users", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ items: rows });
  });
});

// Add more routes and database operations as needed

router.get("/home", (req, res) => {
  res.render("home"); // Render and send an HTML page
});

export default router;
