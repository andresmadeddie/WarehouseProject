require("dotenv").config(); // Load environment variables from .env file

// External dependencies
const express = require("express"); // Web application framework
const mongoose = require("mongoose"); // MongoDB object modeling tool
const morgan = require('morgan'); // HTTP request logger middleware
const path = require('path'); // Node.js path module for file/directory paths
const cors = require("cors"); // Cross-Origin Resource Sharing - allows requests from different origins

// Internal route modules
const warehouseRoute = require("./routes/warehouse.route.js");
const inventoryRoute = require("./routes/inventory.route.js");
const transferRoute = require("./routes/transfer.route.js");
const activityRoute = require("./routes/activity.route.js");

// Initialize Express application
const app = express();

// Middleware
app.use(cors()); // Allow requests from different origins (frontend)
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded form data
app.use(morgan('dev')); // Log HTTP requests in development format with colors

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public'))); // Serve files from public directory

// API Routes - must come before catch-all route
app.use("/api/warehouses", warehouseRoute); // Warehouse CRUD operations
app.use("/api/inventory", inventoryRoute); // Inventory CRUD operations
app.use("/api/transfers", transferRoute); // Transfer operations
app.use("/api/activity", activityRoute); // Activity log operations

// Catch-all route - serves index.html for any non-API routes (SPA support)
app.get(/.*/, (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));

// Database Connection and Server Start
mongoose
    .connect(process.env.MONGO_URI ?? "mongodb://localhost:27017/myDB") // Connect to MongoDB
    .then(() => {
        console.log("Connected to MongoDB");
        const PORT = process.env.PORT ?? 3000;
        app.listen(PORT, () => { // Start HTTP server
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => console.log("MongoDB connection failed:", err)); // Handle connection errors