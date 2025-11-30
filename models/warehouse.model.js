// Warehouse Model - Defines the schema for warehouse documents in MongoDB

const mongoose = require('mongoose');

// Define the warehouses schema
const WarehouseSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Warehouse name is required"],
            trim: true
        },
        location: {
            type: String,
            required: [true, "Location is required"],
            trim: true
        },
        capacity: {
            type: Number,
            required: [true, "Capacity is required"],
            min: [1, "Capacity must be at least 1"]
        },
        currentStock: {
            type: Number,
            required: true,
            default: 0,
            min: [0, "Current stock cannot be negative"]
        }
    },
    {
        timestamps: true // Automatically adds createdAt and updatedAt fields
    }
);

// Create and export the Warehouse model
const Warehouse = mongoose.model("Warehouse", WarehouseSchema);

module.exports = Warehouse;