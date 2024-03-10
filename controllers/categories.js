const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database('./db/mydatabase.db');


async function getCategories(req, res) {
    db.all('SELECT * FROM categories', (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    });
}

module.exports = {getCategories}