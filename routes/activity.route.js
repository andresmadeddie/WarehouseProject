const express = require("express"); // Import Express framework
const router = express.Router(); // Create a new router instance

// Import controller functions for activity operations
const { getActivities, getActivity, createActivity } = require('../controllers/activity.controller.js');

// Define routes and map them to controller functions
router.get('/', getActivities); // GET all activities
router.get('/:id', getActivity); // GET a single activity by ID
router.post('/', createActivity); // POST (create) a new activity

// Export the router so it can be used in other files (e.g., app.js)
module.exports = router;