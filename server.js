require("dotenv").config({ path: "./.env" });
const express = require("express");
const json = require("express");
const cookieParser = require("cookie-parser");
const sqlite3 = require("sqlite3").verbose();
const morgan = require("morgan");

const app = express();
app.use(cookieParser());
app.use(express.json());
const PORT = 3000;

app.use(morgan("dev"));

app.get("/login", (req, res) => {
  res.send("Login page"); // Implement your login page here
});
async function loginAdmin(req, res) {
  try {
    console.log(process.env.USER, process.env.PASSWORD);

    const { username, password } = req.body;

    if (username === process.env.USER && password === process.env.PASSWORD) {
      res.cookie("token", "123456789AAAA");
      res.send("admin page");
    } else {
      res.send("login page");
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "internal server error" });
  }
}

app.post("/login", loginAdmin);

app.get("/admin", (req, res) => {
  res.send("Admin interface");
});

app.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/").send("logout!");
});

app.get("/", (req, res) => {
  res.json({ message: "Hello, this is the home page!" });
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

app.get("/api/items", (req, res) => {
  try {
    const token = req.headers.token;
    console.log(token);
    if (token === process.env.ADMIN_COOKIE) {
      // Admin view: retrieve all items
      db.all("SELECT * FROM items", (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        console.log("admin is here");
        res.json({ items: rows });
      });
    } else {
      // User view: retrieve only available items
      db.all("SELECT * FROM items WHERE is_available = 1", (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        console.log("admin is not here");
        res.json({ items: rows });
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "not working" });
  }
});

app.get("/users", (req, res) => {
  db.all("SELECT * FROM users", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ items: rows });
  });
});

app.get("/lends", (req, res) => {
  db.all("SELECT * FROM users", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ lends: rows });
  });
});

// Add more routes and database operations as needed

app.get("/home", (req, res) => {
  res.render("home"); // Render and send an HTML page
});

app.use((err, req, res, next) => {
  // Handle errors here
});

app.get("/search", (req, res) => {
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
