const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database('./db/mydatabase.db');

async function createCategory(req, res) {
  const newCategory = req.body;

  // Prepare a parameterized query to insert the new item
  const insertQuery = `
    INSERT INTO categories (
      id, name
    ) VALUES (?, ?)
  `;

  const values = [
    newCategory.id,
    newCategory.name,

  ];

  // Execute the query with parameters
  db.run(insertQuery, values, (err) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: 'Error saving category to the database' });
    }

    console.log('Category saved successfully!');
    res.status(201).json({ message: 'Category created successfully', categories: newCategory });
  });
}

async function updateCategory(req, res) {
  const updatedCategory = req.body;
  const categoryId = req.params.id;

  // set a parameterized query to update the item with the provided ID
  const updateQuery = `
    UPDATE categories
    SET  id = ?, name= ?
    WHERE id = ?
  `;

  // runnig the query with the updated values and the provided ID
  db.run(updateQuery, [
    updatedCategory.id,
    updatedCategory.name,
    categoryId
  ], (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Failed to update category in the database' });
    } else {
      res.status(200).json({ message: 'Category updated successfully' });
    }

  });
}
async function deleteCategory(req, res) {
  const categoryId = req.params.id;

  // Prepare a parameterized query to delete the item with the provided ID
  const deleteQuery = `
    DELETE FROM categories
    WHERE id = ?
  `;

  // Execute the query with the provided ID
  db.run(deleteQuery, [categoryId], (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Failed to delete category from the database' });
    } else {
      res.status(200).json({ message: 'Category deleted successfully' });
    }
  });

}



async function getCategories(req, res) {
  db.all('SELECT * FROM categories', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
}

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
};