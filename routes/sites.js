const express = require("express");
const router = express.Router();
const connection = require("../db");

// Create (POST) - To create a new site
router.post("/sites", (req, res) => {
  const { name } = req.body;

  connection.query(
    "INSERT INTO sites (name) VALUES (?)",
    [name],
    (error, results) => {
      if (error) {
        console.error("Error creating site:", error);
        res.status(500).json({ error: "Could not create site" });
      } else {
        res.status(201).json({ id: results.insertId, name });
      }
    }
  );
});

// Read (GET) - To retrieve a list of all sites or a specific site by ID
router.get("/sites", async (req, res) => {
  connection.query("SELECT * FROM sites", function (err, rows, fields) {
    if (err) throw err;
    res.send(rows);
  });
});

// Define the route for getting a specific site by ID
router.get("/sites/:id", (req, res) => {
  const siteId = req.params.id;

  connection.query(
    "SELECT * FROM sites WHERE id = ?",
    [siteId],
    (error, rows) => {
      if (error) {
        console.error("Error fetching site:", error);
        res.status(500).json({ error: "Could not fetch site" });
      } else {
        if (rows.length === 0) {
          res.status(404).json({ error: "Site not found" });
        } else {
          res.json(rows[0]);
        }
      }
    }
  );
});
// Define the route for updating a site by ID
router.put("/sites/:id", (req, res) => {
  const siteId = req.params.id;
  const { name } = req.body;

  connection.query(
    "UPDATE sites SET name = ? WHERE id = ?",
    [name, siteId],
    (error) => {
      if (error) {
        console.error("Error updating site:", error);
        res.status(500).json({ error: "Could not update site" });
      } else {
        res.json({ id: siteId, name });
      }
    }
  );
});

// Define the route for deleting a site by ID
router.delete("/sites/:id", (req, res) => {
  const siteId = req.params.id;

  connection.query(
    "DELETE FROM sites WHERE id = ?",
    [siteId],
    (error, results) => {
      if (error) {
        console.error("Error deleting site:", error);
        res.status(500).json({ error: "Could not delete site" });
      } else {
        if (results.affectedRows === 0) {
          res.status(404).json({ error: "Site not found" });
        } else {
          res.json({ message: "Site deleted successfully" });
        }
      }
    }
  );
});

module.exports = router;
