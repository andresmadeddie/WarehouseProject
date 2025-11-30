const Activity = require("../models/activity.model"); // Import Activity model

// GET ALL activities
const getActivities = async (req, res) => {
    try {
        const activities = await Activity.find({}); // Fetch all activities
        res.status(200).json(activities); // Send activities as JSON
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle server error
    }
};

// GET ONE activity by ID
const getActivity = async (req, res) => {
    try {
        const { id } = req.params; // Extract activity ID from URL
        const activity = await Activity.findById(id); // Find activity by ID
        res.status(200).json(activity); // Send activity as JSON
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle server error
    }
};

// CREATE a new activity
const createActivity = async (req, res) => {
    try {
        const activity = await Activity.create(req.body); // Create activity from request body
        res.status(200).json(activity); // Send created activity as JSON
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle server error
    }
};

// Export all controller functions
module.exports = {
    getActivities,
    getActivity,
    createActivity,
};