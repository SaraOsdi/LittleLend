require("dotenv").config({ path: "./.env" });
const express = require("express");
const json = require("express");
const cookieParser = require("cookie-parser");
const sqlite3 = require("sqlite3").verbose();
const morgan = require("morgan");
const bodyParser = require('body-parser');


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
    security_deposit_amount INTEGER,
    lending_date TEXT,
    returning_date TEXT,
    is_active INTEGER
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

// create items

app.use(bodyParser.json());

app.post('/api/items', (req, res) => {
  const newProduct = req.body;

  // Create a connection to the database
  const db = new sqlite3.Database('mydatabase.db');

  // Prepare a parameterized query to insert the new item
  const insertQuery = `
    INSERT INTO items (
      id, category, picture, name, brand, description, age_range,
      security_deposit_rate, borrow_lend_indicator, listed_date, is_available
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    newProduct.id,
    newProduct.category,
    newProduct.picture,
    newProduct.name,
    newProduct.brand,
    newProduct.description,
    newProduct.age_range,
    newProduct.security_deposit_rate,
    newProduct.borrow_lend_indicator,
    newProduct.listed_date,
    newProduct.is_available
  ];

  // Execute the query with parameters
  db.run(insertQuery, values, (err) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: 'Error saving item to the database' });
    }

    console.log('Item saved successfully!');
    res.status(201).json({ message: 'Item created successfully', items: newProduct });
  });

  // Close the database connection
  db.close();
});



// edit Items
app.use(bodyParser.json());

app.put('/api/items/:id', (req, res) => {
  const updatedProduct = req.body;
  const productId = req.params.id;

  // connection to the database - I think you have this 
  const db = new sqlite3.Database('mydatabase.db');

  // set a parameterized query to update the item with the provided ID
  const updateQuery = `
    UPDATE items
    SET category = ?, picture = ?, name = ?, brand = ?, description = ?,
        age_range = ?, security_deposit_rate = ?, borrow_lend_indicator = ?,
        listed_date = ?, is_available = ?
    WHERE id = ?
  `;

  // runnig the query with the updated values and the provided ID
  db.run(updateQuery, [
    updatedProduct.category,
    updatedProduct.picture,
    updatedProduct.name,
    updatedProduct.brand,
    updatedProduct.description,
    updatedProduct.age_range,
    updatedProduct.security_deposit_rate,
    updatedProduct.borrow_lend_indicator,
    updatedProduct.listed_date,
    updatedProduct.is_available,
    productId
  ], (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Failed to update item in the database' });
    } else {
      res.status(200).json({ message: 'Item updated successfully' });
    }

    // cclose the database connection inside the callback
    db.close();
  });
});

// Delete items

app.delete('/api/items/:id', (req, res) => {
  const productId = req.params.id;

  // Create a connection to the database
  const db = new sqlite3.Database('mydatabase.db');

  // Prepare a parameterized query to delete the item with the provided ID
  const deleteQuery = `
    DELETE FROM items
    WHERE id = ?
  `;

  // Execute the query with the provided ID
  db.run(deleteQuery, [productId], (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Failed to delete item from the database' });
    } else {
      res.status(200).json({ message: 'Item deleted successfully' });
    }
  });

  // Close the database connection
  db.close();
});

// create lends

app.use(bodyParser.json());

app.post('/api/lends', (req, res) => {
  const newLends = req.body;

  // Create a connection to the database
  const db = new sqlite3.Database('mydatabase.db');

  // Prepare a parameterized query to insert the new item
  const insertQuery = `
    INSERT INTO lends (
      id, item_id, borrower_name, phone_number, security_deposit_method, security_deposit_amount, 
      lending_date, returning_date, is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    newLends.id,
    newLends.item_id,
    newLends.borrower_name,
    newLends.phone_number,
    newLends.security_deposit_method,
    newLends.security_deposit_amount,
    newLends.lending_date,
    newLends.returning_date,
    newLends.is_active
  ];

  // Execute the query with parameters
  db.run(insertQuery, values, (err) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: 'Error saving item to the database' });
    }

    console.log('Item saved successfully!');
    res.status(201).json({ message: 'Lend created successfully', items: newLends });
  });

  // Close the database connection
  db.close();
});

// edit Lends
app.use(bodyParser.json());

app.put('/api/lends/:id', (req, res) => {
  const updatedLend = req.body;
  const lendId = req.params.id;

  // connection to the database - I think you have this 
  const db = new sqlite3.Database('mydatabase.db');

  // set a parameterized query to update the item with the provided ID
  const updateQuery = `
    UPDATE lends
    SET item_id = ?, borrower_name = ?, phone_number = ?, security_deposit_method = ?, security_deposit_amount = ?, 
    lending_date = ?, returning_date = ?, is_active = ?
    WHERE id = ?
  `;

  // runnig the query with the updated values and the provided ID
  db.run(updateQuery, [
    updatedLend.item_id,
    updatedLend.borrower_name,
    updatedLend.phone_number,
    updatedLend.security_deposit_method,
    updatedLend.security_deposit_amount,
    updatedLend.lending_date,
    updatedLend.returning_date,
    updatedLend.is_active,
    lendId
  ], (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Failed to update lend in the database' });
    } else {
      res.status(200).json({ message: 'Lend updated successfully' });
    }

    // cclose the database connection inside the callback
    db.close();
  });
});

// Delete lends

app.delete('/api/lends/:id', (req, res) => {
  const lendId = req.params.id;

  // Create a connection to the database
  const db = new sqlite3.Database('mydatabase.db');

  // Prepare a parameterized query to delete the item with the provided ID
  const deleteQuery = `
    DELETE FROM lends
    WHERE id = ?
  `;

  // Execute the query with the provided ID
  db.run(deleteQuery, [lendId], (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Failed to delete item from the database' });
    } else {
      res.status(200).json({ message: 'Item deleted successfully' });
    }
  });

  // Close the database connection
  db.close();
});


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
  db.all("SELECT * FROM lends", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ lends: rows });
  });
});

app.get("/lends/search", (req, res) => {
  try {
    const searchTerm = req.query.searchTerm || '';
    const activeLendsOnly = req.query.activeLendsOnly === 'true';
    const overdueLendsOnly = req.query.overdueLendsOnly === 'true';

    const query = `
      SELECT lends.id,
             lends.item_id,
             lends.borrower_name,
             lends.phone_number,
             lends.security_deposit_method,
             lends.security_deposit_amount,
             lends.lending_date,
             lends.returning_date,
             lends.is_active,
             items.name AS item_name,
             items.brand AS item_brand
      FROM lends
      LEFT JOIN items ON lends.item_id = items.id
      WHERE
        (items.name LIKE ? OR items.brand LIKE ?)
        ${activeLendsOnly ? 'AND lends.is_active = 1' : ''}
        ${overdueLendsOnly ? 'AND (lends.returning_date IS NOT NULL AND lends.returning_date < date("now"))' : ''}
    `;

    // Parameters for the SQL query
    const params = [
      `%${searchTerm}%`,
      `%${searchTerm}%`
    ];

    // Execute the query
    db.all(query, params, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ lends: rows });
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "not working" });
  }
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
        WHERE (name LIKE ? OR description LIKE ? OR brand LIKE ? OR age_range LIKE ?)
        AND (age_range LIKE ? OR ? IS NULL);
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
        AND (name LIKE ? OR description LIKE ? OR brand LIKE ? OR age_range LIKE ?)
        AND (age_range LIKE ? OR ? IS NULL);
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
