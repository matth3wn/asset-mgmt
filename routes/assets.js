const express = require("express");
const router = express.Router();
const connection = require("../db");

// Create (POST) - To create a new asset
router.post('/assets', (req, res) => {
    const { name, description, image_url, username, location, site_id } = req.body;
  
    connection.query(
      'INSERT INTO assets (name, description, image_url, username, location, site_id) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, image_url, username, location, site_id],
      (error, results) => {
        if (error) {
          console.error('Error creating asset:', error);
          res.status(500).json({ error: 'Could not create asset' });
        } else {
          res.status(201).json({ id: results.insertId, name, description, image_url, username, location, site_id });
        }
      }
    );
  });
  
  // Read (GET) - To retrieve a list of all assets or a specific asset by ID
  router.get('/assets', (req, res) => {
    connection.query('SELECT * FROM assets', (error, rows) => {
      if (error) {
        console.error('Error fetching assets:', error);
        res.status(500).json({ error: 'Could not fetch assets' });
      } else {
        res.json(rows);
      }
    });
  });
  
  router.get('/assets/:id', (req, res) => {
    const assetId = req.params.id;
  
    connection.query('SELECT * FROM assets WHERE id = ?', [assetId], (error, rows) => {
      if (error) {
        console.error('Error fetching asset:', error);
        res.status(500).json({ error: 'Could not fetch asset' });
      } else {
        if (rows.length === 0) {
          res.status(404).json({ error: 'Asset not found' });
        } else {
          res.json(rows[0]);
        }
      }
    });
  });
  
  // Update (PUT) - To update an asset by ID
  router.put('/assets/:id', (req, res) => {
    const assetId = req.params.id;
    const { name, description, image_url, username, location, site_id } = req.body;
  
    connection.query(
      'UPDATE assets SET name = ?, description = ?, image_url = ?, username = ?, location = ?, site_id = ? WHERE id = ?',
      [name, description, image_url, username, location, site_id, assetId],
      (error) => {
        if (error) {
          console.error('Error updating asset:', error);
          res.status(500).json({ error: 'Could not update asset' });
        } else {
          res.json({ id: assetId, name, description, image_url, username, location, site_id });
        }
      }
    );
  });
  
  // Delete (DELETE) - To delete an asset by ID
  router.delete('/assets/:id', (req, res) => {
    const assetId = req.params.id;
  
    connection.query('DELETE FROM assets WHERE id = ?', [assetId], (error, results) => {
      if (error) {
        console.error('Error deleting asset:', error);
        res.status(500).json({ error: 'Could not delete asset' });
      } else {
        if (results.affectedRows === 0) {
          res.status(404).json({ error: 'Asset not found' });
        } else {
          res.json({ message: 'Asset deleted successfully' });
        }
      }
    });
  });
  
  module.exports = router;