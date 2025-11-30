const mongoose = require('mongoose'); // Import Mongoose library for MongoDB operations

// Define schema for Product collection
const ProductSchema = mongoose.Schema(
    {
        name: { // Product name field
            type: String, // Data type: String
            required: [true, "Please enter product name"] // Validation: required with custom message
        },
        quantity: { // Product quantity field
            type: Number, // Data type: Number
            required: true, // Validation: required
            default: 0 // Default value if not provided
        },
        price: { // Product price field
            type: Number, // Data type: Number
            default: 0 // Default value if not provided
        },
        image: { // Product image URL field
            type: String, // Data type: String
            required: false // Optional field
        }
    },
    {
        timestamps: true // Automatically adds createdAt and updatedAt fields
    }
);

// Create Product model from schema
const Product = mongoose.model("Product", ProductSchema);

// Export Product model for use in other files
module.exports = Product;