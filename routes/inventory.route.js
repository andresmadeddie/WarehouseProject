const express = require("express"); // Import Express framework
const router = express.Router(); // Create a new router instance

// Import controller functions for Inventory operations
const { getInventories, getInventory, createInventory, updateInventory, deleteInventory } = require('../controllers/inventory.controller.js');

// Define routes and map them to controller functions
router.get('/', getInventories); // GET all Inventories
router.get('/:id', getInventory); // GET a single Inventory by ID
router.post('/', createInventory); // POST (create) a new Inventory
router.put('/:id', updateInventory); // PUT (update) a Inventory by ID
router.delete('/:id', deleteInventory); // DELETE a Inventory by ID

// Export the router so it can be used in other files (e.g., app.js)
module.exports = router;