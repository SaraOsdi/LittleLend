const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database('./db/mydatabase.db');

async function createItem(req, res){
    const newProduct = req.body;
  
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
  
    db.run(insertQuery, values, (err) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ message: 'Error saving item to the database' });
      }
  
      console.log('Item saved successfully!');
      res.status(201).json({ message: 'Item created successfully', items: newProduct });
    });
  
  }

  

  

  async function updateItem(req, res){
  const updatedProduct = req.body;
  const productId = req.params.id;

  const updateQuery = `
    UPDATE items
    SET category = ?, picture = ?, name = ?, brand = ?, description = ?,
        age_range = ?, security_deposit_rate = ?, borrow_lend_indicator = ?,
        listed_date = ?, is_available = ?
    WHERE id = ?
  `;

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

  });
}

async function deleteItem(req, res){
    const productId = req.params.id;
  
    const deleteQuery = `
      DELETE FROM items
      WHERE id = ?
    `;

    db.run(deleteQuery, [productId], (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to delete item from the database' });
      } else {
        res.status(200).json({ message: 'Item deleted successfully' });
      }
    });
 
  }



  async function getItems(req, res){
    try {
      const token = req.headers.token;
      const categoryId = req.query.categoryId; 
      console.log(token);
      if (token === process.env.ADMIN_COOKIE) {
        let sqlQuery = "SELECT * FROM items";
        const params = [];
        if (categoryId) {
          sqlQuery += " WHERE category_id = ?";
          params.push(categoryId);
        }
        db.all(sqlQuery, params, (err, rows) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          console.log("admin is here");
          res.json({ items: rows });
        });
      } else {
        let sqlQuery = "SELECT * FROM items WHERE is_available = 1";
        const params = [];
        if (categoryId) {
          sqlQuery += " AND category_id = ?";
          params.push(categoryId);
        }
        db.all(sqlQuery, params, (err, rows) => {
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
  }



  async function searchItems(req, res){

    try {
      const token = req.headers.token;
      const { searchTerm } = req.query;
      console.log(token);
      if (token === process.env.ADMIN_COOKIE) {
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
      G
  });
  }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "not working" });
  }
  }
  

  module.exports = {createItem,
    updateItem,
    deleteItem,
    getItems,
    searchItems
};
 