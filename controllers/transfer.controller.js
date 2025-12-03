const mongoose = require('mongoose');
const Transfer = require("../models/transfer.model"); // Import Transfer model

// GET ALL transfers
const getTransfers = async (req, res) => {
    try {
        const transfers = await Transfer.find({}).lean(); // Fetch all transfers
        res.status(200).json(transfers); // Send transfers as JSON
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle server error
    }
};

// GET ONE transfer by ID
const getTransfer = async (req, res) => {
    try {
        const { id } = req.params; // Extract transfer ID from URL
        const transfer = await Transfer.findById(id); // Find transfer by ID
        res.status(200).json(transfer); // Send transfer as JSON
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle server error
    }
};

// CREATE a new transfer
const createTransfer = async (req, res) => {
    try {
        // Convert ObjectId fields
        if (req.body.itemId && typeof req.body.itemId === 'string') {
            req.body.itemId = new mongoose.Types.ObjectId(req.body.itemId);
        }
        if (req.body.fromWarehouseId && typeof req.body.fromWarehouseId === 'string') {
            req.body.fromWarehouseId = new mongoose.Types.ObjectId(req.body.fromWarehouseId);
        }
        if (req.body.toWarehouseId && typeof req.body.toWarehouseId === 'string') {
            req.body.toWarehouseId = new mongoose.Types.ObjectId(req.body.toWarehouseId);
        }

        const transfer = await Transfer.create(req.body); // Create transfer from request body
        res.status(200).json(transfer); // Send created transfer as JSON
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle server error
    }
};

// Export all controller functions
module.exports = {
    getTransfers,
    getTransfer,
    createTransfer,
};