const Warehouse = require("../models/warehouse.model"); // Import Warehouses model

// GET ALL warehouses
const getWarehouses = async (req, res) => {
    try {
        const warehouses = await Warehouse.find({}).lean(); // Fetch all warehouses
        res.status(200).json(warehouses); // Send warehouses as JSON
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle server error
    }
};

// GET ONE warehouse by ID
const getWarehouse = async (req, res) => {
    try {
        const { id } = req.params; // Extract warehouse ID from URL
        const warehouse = await Warehouse.findById(id); // Find warehouse by ID
        res.status(200).json(warehouse); // Send warehouse as JSON
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle server error
    }
};

// CREATE a new warehouse
const createWarehouse = async (req, res) => {
    try {
        const warehouse = await Warehouse.create(req.body); // Create warehouse from request body
        res.status(200).json(warehouse); // Send created warehouse as JSON
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle server error
    }
};

// UPDATE an existing warehouse by ID
const updateWarehouse = async (req, res) => {
    try {
        const { id } = req.params; // Extract warehouse ID
        const warehouse = await Warehouse.findByIdAndUpdate(id, req.body, { new: true }); // Update warehouse

        if (!warehouse) {
            return res.status(404).json({ message: "Warehouse not found" }); // Handle not found
        }

        res.status(200).json(warehouse); // Send updated warehouse
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle server error
    }
};

// DELETE a warehouse by ID
const deleteWarehouse = async (req, res) => {
    try {
        const { id } = req.params; // Extract warehouse ID
        const warehouse = await Warehouse.findByIdAndDelete(id); // Delete warehouse

        if (!warehouse) {
            return res.status(404).json({ message: "Warehouse not found" }); // Handle not found
        }

        res.status(200).json({ message: "Warehouse deleted successfully" }); // Confirm deletion
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle server error
    }
};

// Export all controller functions
module.exports = {
    getWarehouses,
    getWarehouse,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse
};