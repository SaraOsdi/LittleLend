const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("mydatabase.db");

db.run(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY,
    name TEXT
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY,
    category_id INTEGER, -- Foreign key referencing categories table
    picture TEXT, 
    name TEXT,
    brand TEXT,
    description TEXT,
    age_range TEXT,
    security_deposit_rate REAL,
    borrow_lend_indicator INTEGER,
    listed_date TEXT,
    is_available INTEGER DEFAULT 1,
    amount INTEGER,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  )
`);


db.run(`
  CREATE TABLE IF NOT EXISTS lends (
    id INTEGER PRIMARY KEY,
    item_id INTEGER, -- Foreign key referencing items table
    borrower_name TEXT,
    phone_number TEXT,
    security_deposit_method TEXT,
    security_deposit_amount INTEGER,
    lending_date TEXT,
    returning_date TEXT,
    is_active INTEGER
  )
`);