// Activity Model - Defines the schema for activity log documents in MongoDB

const mongoose = require('mongoose');

// Define the activity log schema
const ActivitySchema = mongoose.Schema(
    {
        action: {
            type: String,
            required: [true, "Action is required"],
            trim: true,
            enum: [
                'Warehouse Added',
                'Warehouse Updated',
                'Warehouse Deleted',
                'Item Added',
                'Item Updated',
                'Item Deleted',
                'Inventory Updated',
                'Transfer Completed'
            ]
        },
        details: {
            type: String,
            required: [true, "Details are required"],
            trim: true
        },
        timestamp: {
            type: Date,
            default: Date.now,
            required: true
        }
    },
    {
        timestamps: false // We're using our own timestamp field
    }
);

// Create an index on timestamp for efficient sorting (newest first)
ActivitySchema.index({ timestamp: -1 });

// Create and export the Activity model
const Activity = mongoose.model("Activity", ActivitySchema);

module.exports = Activity;