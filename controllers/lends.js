const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database('./db/mydatabase.db');

async function createLend(req, res){
  const newLends = req.body;

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

  db.run(insertQuery, values, (err) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: 'Error saving item to the database' });
    }

    console.log('Item saved successfully!');
    res.status(201).json({ message: 'Lend created successfully', items: newLends });
  });

}



async function editLend(req, res){
    const updatedLend = req.body;
    const lendId = req.params.id;
  

  
    const updateQuery = `
      UPDATE lends
      SET item_id = ?, borrower_name = ?, phone_number = ?, security_deposit_method = ?, security_deposit_amount = ?, 
      lending_date = ?, returning_date = ?, is_active = ?
      WHERE id = ?
    `;
  
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
  
    });
  }


  async function deleteLend(req, res){
    const lendId = req.params.id;
 
    const deleteQuery = `
      DELETE FROM lends
      WHERE id = ?
    `;
  
    db.run(deleteQuery, [lendId], (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to delete item from the database' });
      } else {
        res.status(200).json({ message: 'Item deleted successfully' });
      }
    });
  
  }
  

  async function getLends(req, res){
    db.all("SELECT * FROM lends", (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ lends: rows });
    });
  }


  
  async function searchLends(req, res){
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
  }
  


module.exports = {createLend,
    editLend,
    deleteLend,
    getLends,
    searchLends
};

