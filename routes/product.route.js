const express = require("express"); // Import Express framework
const router = express.Router(); // Create a new router instance

// Import controller functions for product operations
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/product.controller.js');

// Define routes and map them to controller functions
router.get('/', getProducts); // GET all products
router.get('/:id', getProduct); // GET a single product by ID
router.post('/', createProduct); // POST (create) a new product
router.put('/:id', updateProduct); // PUT (update) a product by ID
router.delete('/:id', deleteProduct); // DELETE a product by ID

// Export the router so it can be used in other files (e.g., app.js)
module.exports = router;