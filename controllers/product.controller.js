const Product = require("../models/product.model"); // Import Product model

// GET ALL products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({}); // Fetch all products
        res.status(200).json(products); // Send products as JSON
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle server error
    }
};

// GET ONE product by ID
const getProduct = async (req, res) => {
    try {
        const { id } = req.params; // Extract product ID from URL
        const product = await Product.findById(id); // Find product by ID
        res.status(200).json(product); // Send product as JSON
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle server error
    }
};

// CREATE a new product
const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body); // Create product from request body
        res.status(200).json(product); // Send created product as JSON
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle server error
    }
};

// UPDATE an existing product by ID
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params; // Extract product ID
        const product = await Product.findByIdAndUpdate(id, req.body, { new: true }); // Update product

        if (!product) {
            return res.status(404).json({ message: "Product not found" }); // Handle not found
        }

        res.status(200).json(product); // Send updated product
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle server error
    }
};

// DELETE a product by ID
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params; // Extract product ID
        const product = await Product.findByIdAndDelete(id); // Delete product

        if (!product) {
            return res.status(404).json({ message: "Product not found" }); // Handle not found
        }

        res.status(200).json({ message: "Product deleted successfully" }); // Confirm deletion
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle server error
    }
};

// Export all controller functions
module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
};