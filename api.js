const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();

router.get("/admin", isAuthenticated, (req, res) => {
  res.send("Admin interface");
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login"); // Redirect to login page if not authenticated
}

router.get("/login", (req, res) => {
  res.send("Login page"); // Implement your login page here
});

// router.post(
//   "/login",
//   passport.authenticate("local", {
//     successRedirect: "/admin",
//     failureRedirect: "/login",
//     failureFlash: true,
//   })
// );

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/", (req, res) => {
  res.send("Hello, this is the home page!");
});

// SQLite setup
const db = new sqlite3.Database("mydatabase.db");

db.run(`
CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY,
  category TEXT, 
  picture TEXT, 
  name TEXT,
  brand TEXT,
  description TEXT,
  age_range TEXT,
  security_deposit_rate REAL,
  borrow_lend_indicator INTEGER,
  listed_date TEXT,
  is_available INTEGER DEFAULT 1
)
`);

db.run(`
CREATE TABLE IF NOT EXISTS lends (
  id INTEGER PRIMARY KEY,
  item_id INTEGER, -- Foreign key referencing items table
  borrower_name TEXT,
  phone_number TEXT,
  security_deposit_method TEXT,
  lending_date TEXT,
  returning_date TEXT
)
`);

db.run(`
CREATE TABLE IF NOT EXISTS borrowers (
  id INTEGER PRIMARY KEY,
  borrower_name TEXT,
  phone_number TEXT,
  is_active INTEGER -- 0 for inactive, 1 for active (for example)
)
`);

db.run(`
CREATE TABLE IF NOT EXISTS borrowers_items (
  borrower_id INTEGER, -- Foreign key referencing borrowers table
  item_id INTEGER -- Foreign key referencing items table
)
`);

// Define routes and middleware here, use GET /api/items to get the data

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

router.get("/lends", (req, res) => {
  db.all("SELECT * FROM users", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ lends: rows });
  });
});

// Add more routes and database operations as needed

router.get("/home", (req, res) => {
  res.render("home"); // Render and send an HTML page
});

router.get("/search", (req, res) => {
  const { searchTerm } = req.query;

  // Check if the request is coming from an authenticated admin
  if (req.isAuthenticated() && req.user.isAdmin) {
    // Admin view: search all items
    const query = `
      SELECT * FROM items
      WHERE name LIKE ? OR description LIKE ? OR brand LIKE ? OR age_range LIKE ?;
    `;
    const params = [
      `%${searchTerm}%`,
      `%${searchTerm}%`,
      `%${searchTerm}%`,
      `%${searchTerm}%`,
    ];

    db.all(query, params, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ items: rows });
    });
  } else {
    // User view: search only available items
    const query = `
      SELECT * FROM items
      WHERE is_available = 1
      AND (name LIKE ? OR description LIKE ? OR brand LIKE ? OR age_range LIKE ?);
    `;
    const params = [
      `%${searchTerm}%`,
      `%${searchTerm}%`,
      `%${searchTerm}%`,
      `%${searchTerm}%`,
    ];

    db.all(query, params, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ items: rows });
    });
  }
});

module.exports = router;
