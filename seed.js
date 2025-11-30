// Seed Script - Populates database with sample data for testing

require("dotenv").config(); // Load environment variables
const mongoose = require("mongoose");

// Import models
const Warehouse = require("./models/warehouse.model");
const Inventory = require("./models/inventory.model");
const Transfer = require("./models/transfer.model");
const Activity = require("./models/activity.model");

// Sample data
const sampleWarehouses = [
    {
        name: "Main Warehouse",
        location: "New York, NY",
        capacity: 10000,
        currentStock: 7500
    },
    {
        name: "West Coast Hub",
        location: "Los Angeles, CA",
        capacity: 8000,
        currentStock: 5200
    },
    {
        name: "Distribution Center",
        location: "Chicago, IL",
        capacity: 12000,
        currentStock: 9800
    },
    {
        name: "East Coast Depot",
        location: "Boston, MA",
        capacity: 6000,
        currentStock: 3200
    }
];

// Function to seed the database
const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB");

        // Clear existing data
        console.log("\n🗑️  Clearing existing data...");
        await Warehouse.deleteMany({});
        await Inventory.deleteMany({});
        await Transfer.deleteMany({});
        await Activity.deleteMany({});
        console.log("✅ Existing data cleared");

        // Insert warehouses
        console.log("\n📦 Seeding warehouses...");
        const warehouses = await Warehouse.insertMany(sampleWarehouses);
        console.log(`✅ ${warehouses.length} warehouses created`);

        // Create sample inventory items
        const sampleInventory = [
            {
                sku: "PROD-001",
                name: "Office Chair",
                warehouseId: warehouses[0]._id,
                location: "A-12",
                quantity: 150,
                description: "Ergonomic office chair with lumbar support"
            },
            {
                sku: "PROD-002",
                name: "Standing Desk",
                warehouseId: warehouses[0]._id,
                location: "B-05",
                quantity: 85,
                description: "Adjustable height standing desk"
            },
            {
                sku: "PROD-003",
                name: "Monitor Stand",
                warehouseId: warehouses[1]._id,
                location: "C-08",
                quantity: 200,
                description: "Dual monitor stand with cable management"
            },
            {
                sku: "PROD-004",
                name: "Keyboard",
                warehouseId: warehouses[1]._id,
                location: "D-03",
                quantity: 300,
                description: "Wireless mechanical keyboard"
            },
            {
                sku: "PROD-005",
                name: "Mouse",
                warehouseId: warehouses[2]._id,
                location: "E-15",
                quantity: 500,
                description: "Wireless optical mouse"
            },
            {
                sku: "PROD-006",
                name: "Laptop Stand",
                warehouseId: warehouses[2]._id,
                location: "F-22",
                quantity: 120,
                description: "Adjustable laptop stand"
            },
            {
                sku: "PROD-007",
                name: "USB-C Hub",
                warehouseId: warehouses[3]._id,
                location: "G-10",
                quantity: 250,
                description: "7-in-1 USB-C hub with HDMI"
            },
            {
                sku: "PROD-008",
                name: "Webcam",
                warehouseId: warehouses[3]._id,
                location: "H-18",
                quantity: 180,
                description: "1080p HD webcam with microphone"
            }
        ];

        console.log("\n📋 Seeding inventory items...");
        const inventory = await Inventory.insertMany(sampleInventory);
        console.log(`✅ ${inventory.length} inventory items created`);

        // Create sample transfers
        const sampleTransfers = [
            {
                itemId: inventory[0]._id,
                itemName: inventory[0].name,
                fromWarehouseId: warehouses[0]._id,
                from: warehouses[0].name,
                toWarehouseId: warehouses[1]._id,
                to: warehouses[1].name,
                quantity: 25,
                date: new Date("2024-11-15")
            },
            {
                itemId: inventory[2]._id,
                itemName: inventory[2].name,
                fromWarehouseId: warehouses[1]._id,
                from: warehouses[1].name,
                toWarehouseId: warehouses[2]._id,
                to: warehouses[2].name,
                quantity: 50,
                date: new Date("2024-11-20")
            }
        ];

        console.log("\n🔄 Seeding transfers...");
        const transfers = await Transfer.insertMany(sampleTransfers);
        console.log(`✅ ${transfers.length} transfers created`);

        // Create sample activity log
        const sampleActivities = [
            {
                action: "Warehouse Added",
                details: `${warehouses[0].name} in ${warehouses[0].location}`,
                timestamp: new Date("2024-11-01")
            },
            {
                action: "Item Added",
                details: `Office Chair (PROD-001) added to inventory`,
                timestamp: new Date("2024-11-05")
            },
            {
                action: "Transfer Completed",
                details: `25 units of Office Chair from ${warehouses[0].name} to ${warehouses[1].name}`,
                timestamp: new Date("2024-11-15")
            },
            {
                action: "Inventory Updated",
                details: "PROD-003 quantity increased by 50",
                timestamp: new Date("2024-11-18")
            },
            {
                action: "Warehouse Updated",
                details: `${warehouses[2].name} details modified`,
                timestamp: new Date("2024-11-22")
            }
        ];

        console.log("\n📝 Seeding activity log...");
        const activities = await Activity.insertMany(sampleActivities);
        console.log(`✅ ${activities.length} activities created`);

        // Summary
        console.log("\n" + "=".repeat(50));
        console.log("🎉 DATABASE SEEDED SUCCESSFULLY!");
        console.log("=".repeat(50));
        console.log(`📦 Warehouses: ${warehouses.length}`);
        console.log(`📋 Inventory Items: ${inventory.length}`);
        console.log(`🔄 Transfers: ${transfers.length}`);
        console.log(`📝 Activities: ${activities.length}`);
        console.log("=".repeat(50));

    } catch (error) {
        console.error("❌ Error seeding database:", error);
    } finally {
        // Disconnect from MongoDB
        await mongoose.connection.close();
        console.log("\n👋 Disconnected from MongoDB");
        process.exit(0);
    }
};

// Run the seed function
seedDatabase();