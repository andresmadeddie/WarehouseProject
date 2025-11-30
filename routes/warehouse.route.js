const express = require("express"); // Import Express framework
const router = express.Router(); // Create a new router instance

// Import controller functions for Warehouse operations
const { getWarehouses, getWarehouse, createWarehouse, updateWarehouse, deleteWarehouse } = require('../controllers/warehouse.controller.js');

// Define routes and map them to controller functions
router.get('/', getWarehouses); // GET all Warehouses
router.get('/:id', getWarehouse); // GET a single Warehouse by ID
router.post('/', createWarehouse); // POST (create) a new Warehouse
router.put('/:id', updateWarehouse); // PUT (update) a Warehouse by ID
router.delete('/:id', deleteWarehouse); // DELETE a Warehouse by ID

// Export the router so it can be used in other files (e.g., app.js)
module.exports = router;