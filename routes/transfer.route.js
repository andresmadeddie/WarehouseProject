const express = require("express"); // Import Express framework
const router = express.Router(); // Create a new router instance

// Import controller functions for transfer operations
const { getTransfers, getTransfer, createTransfer } = require('../controllers/transfer.controller.js');

// Define routes and map them to controller functions
router.get('/', getTransfers); // GET all tranfers
router.get('/:id', getTransfer); // GET a single tranfer by ID
router.post('/', createTransfer); // POST (create) a new transfer

// Export the router so it can be used in other files (e.g., app.js)
module.exports = router;