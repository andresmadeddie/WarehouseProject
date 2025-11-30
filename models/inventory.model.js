// Inventory Model - Defines the schema for inventory item documents in MongoDB

const mongoose = require('mongoose');

// Define the inventory item schema
const InventorySchema = mongoose.Schema(
    {
        sku: {
            type: String,
            required: [true, "SKU is required"],
            trim: true,
            uppercase: true
        },
        name: {
            type: String,
            required: [true, "Item name is required"],
            trim: true
        },
        warehouseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Warehouse', // Reference to Warehouse model
            required: [true, "Warehouse ID is required"]
        },
        location: {
            type: String,
            required: [true, "Storage location is required"],
            trim: true
        },
        quantity: {
            type: Number,
            required: [true, "Quantity is required"],
            min: [0, "Quantity cannot be negative"]
        },
        description: {
            type: String,
            default: "",
            trim: true
        }
    },
    {
        timestamps: true // Automatically adds createdAt and updatedAt fields
    }
);

// Create a compound index for SKU and warehouseId to enforce uniqueness per warehouse
InventorySchema.index({ sku: 1, warehouseId: 1 }, { unique: true });

// Create and export the Inventory model
const Inventory = mongoose.model("Inventory", InventorySchema);

module.exports = Inventory;