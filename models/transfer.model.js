// Transfer Model - Defines the schema for transfer history documents in MongoDB

const mongoose = require('mongoose');

// Define the transfer schema
const TransferSchema = mongoose.Schema(
    {
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Inventory', // Reference to Inventory model
            required: [true, "Item ID is required"]
        },
        itemName: {
            type: String,
            required: [true, "Item name is required"],
            trim: true
        },
        fromWarehouseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Warehouse', // Reference to source Warehouse
            required: [true, "Source warehouse ID is required"]
        },
        from: {
            type: String,
            required: [true, "Source warehouse name is required"],
            trim: true
        },
        toWarehouseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Warehouse', // Reference to destination Warehouse
            required: [true, "Destination warehouse ID is required"]
        },
        to: {
            type: String,
            required: [true, "Destination warehouse name is required"],
            trim: true
        },
        quantity: {
            type: Number,
            required: [true, "Transfer quantity is required"],
            min: [1, "Transfer quantity must be at least 1"]
        },
        date: {
            type: Date,
            default: Date.now,
            required: true
        }
    },
    {
        timestamps: true // Automatically adds createdAt and updatedAt fields
    }
);

// Create and export the Transfer model
const Transfer = mongoose.model("Transfer", TransferSchema);

module.exports = Transfer;