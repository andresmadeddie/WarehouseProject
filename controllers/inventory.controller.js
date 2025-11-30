const mongoose = require('mongoose');
const Inventory = require("../models/inventory.model"); // Import Inventory model

// GET ALL inventories
const getInventories = async (req, res) => {
    try {
        const inventories = await Inventory.find({}); // Fetch all inventories
        res.status(200).json(inventories); // Send inventories as JSON
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle server error
    }
};

// GET ONE inventory by ID
const getInventory = async (req, res) => {
    try {
        const { id } = req.params; // Extract inventory ID from URL
        const inventory = await Inventory.findById(id); // Find inventory by ID
        res.status(200).json(inventory); // Send inventory as JSON
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle server error
    }
};

// CREATE a new inventory
const createInventory = async (req, res) => {
    try {
        // Convert warehouseId string to ObjectId
        if (req.body.warehouseId && typeof req.body.warehouseId === 'string') {
            req.body.warehouseId = new mongoose.Types.ObjectId(req.body.warehouseId);
        }
        
        const inventory = await Inventory.create(req.body); // Create inventory from request body
        res.status(200).json(inventory); // Send created inventory as JSON
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle server error
    }
};

// UPDATE an existing inventory by ID
const updateInventory = async (req, res) => {
    try {
        const { id } = req.params; // Extract inventory ID
        const inventory = await Inventory.findByIdAndUpdate(id, req.body, { new: true }); // Update inventory

        if (!inventory) {
            return res.status(404).json({ message: "Inventory not found" }); // Handle not found
        }

        res.status(200).json(inventory); // Send updated inventory
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle server error
    }
};

// DELETE a inventory by ID
const deleteInventory = async (req, res) => {
    try {
        const { id } = req.params; // Extract inventory ID
        const inventory = await Inventory.findByIdAndDelete(id); // Delete inventory

        if (!inventory) {
            return res.status(404).json({ message: "Inventory not found" }); // Handle not found
        }

        res.status(200).json({ message: "Inventory deleted successfully" }); // Confirm deletion
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle server error
    }
};

// Export all controller functions
module.exports = {
    getInventories,
    getInventory,
    createInventory,
    updateInventory,
    deleteInventory
};