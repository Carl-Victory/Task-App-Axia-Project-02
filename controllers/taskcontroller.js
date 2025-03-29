// Import the Task model to interact with the tasks collection in the database
const Task = require('../models/taskmodel');



//CREATE TASK
// Create a new task for the logged-in user
const createTask = async (req, res) => {
    try {
        // Extract task details from the request body
        const { title, description, category, deadline, isImportant } = req.body;

        // Create a new task object with the provided details and associate it with the logged-in user
        const newTask = new Task({
            title, // Task title
            description, // Task description
            category, // Task category
            deadline, // Task deadline
            isImportant, // Whether the task is marked as important
            userId: req.user, // Associate the task with the logged-in user's ID
        });

        // Save the new task to the database
        await newTask.save();

        // Respond with a success message and the created task
        res.status(201).json({ message: 'Task created successfully', task: newTask });
    } catch (error) {
        // Handle any errors that occur during task creation
        res.status(500).json({ message: 'Error creating task', error: error.message });
    }
};



// GET ALL TASKS
const getAllTasks = async (req, res) => {
    try {
        // Find all tasks in the database that belong to the logged-in user
        const tasks = await Task.find({ userId: req.user });

        // Respond with a success message and the retrieved tasks
        res.status(200).json({ message: 'Tasks retrieved successfully', tasks });
    } catch (error) {
        // Handle any errors that occur during task retrieval
        res.status(500).json({ message: 'Error retrieving tasks', error: error.message });
    }
};


// GET TASKS BY DATE
const getTasksByDate = async (req, res) => {
    try {
        // Extract the date from the request parameters
        const { date } = req.params;

        // Parse the date and calculate the start and end of the day
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        // Find tasks created on the specified date that belong to the logged-in user
        const tasks = await Task.find({
            userId: req.user, // Ensure tasks belong to the logged-in user
            createdAt: { $gte: startOfDay, $lte: endOfDay }, // Filter tasks by creation date
        });

        // Respond with a success message and the retrieved tasks
        res.status(200).json({ message: 'Tasks retrieved successfully', tasks });
    } catch (error) {
        // Handle any errors that occur during task retrieval
        res.status(500).json({ message: 'Error retrieving tasks by date', error: error.message });
    }
};



// GET TODAY'S TASKS
const getTodayTasks = async (req, res) => {
    try {
        // Calculate the start and end of the current day
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        // Find tasks created today that belong to the logged-in user
        const tasks = await Task.find({
            userId: req.user, // Ensure tasks belong to the logged-in user
            createdAt: { $gte: today, $lte: endOfToday }, // Filter tasks by creation date
        }).sort({
            isComplete: 1, // Sort by completion status (incomplete tasks first)
            isImportant: -1, // Sort by importance (important tasks first)
        });

        // Respond with a success message and the retrieved tasks
        res.status(200).json({ message: 'Today\'s tasks retrieved successfully', tasks });
    } catch (error) {
        // Handle any errors that occur during task retrieval
        res.status(500).json({ message: 'Error retrieving today\'s tasks', error: error.message });
    }
};



// GET TASKS BY CATEGORY
const getTasksByCategory = async (req, res) => {
    try {
        // Extract the category from the request parameters
        const { category } = req.params;

        // Find tasks in the specified category that belong to the logged-in user
        const tasks = await Task.find({
            userId: req.user, // Ensure tasks belong to the logged-in user
            category: category, // Filter tasks by category
        });

        // Respond with a success message and the retrieved tasks
        res.status(200).json({ message: 'Tasks retrieved successfully', tasks });
    } catch (error) {
        // Handle any errors that occur during task retrieval
        res.status(500).json({ message: 'Error retrieving tasks by category', error: error.message });
    }
};



// GET OVERDUE TASKS
const getOverdueTasks = async (req, res) => {
    try {
        // Get the current date and time
        const now = new Date();

        // Find tasks with deadlines before the current date that are incomplete and belong to the logged-in user
        const tasks = await Task.find({
            userId: req.user, // Ensure tasks belong to the logged-in user
            deadline: { $lt: now }, // Filter tasks with deadlines before now
            isComplete: false, // Only include incomplete tasks
        });

        // Respond with a success message and the retrieved tasks
        res.status(200).json({ message: 'Overdue tasks retrieved successfully', tasks });
    } catch (error) {
        // Handle any errors that occur during task retrieval
        res.status(500).json({ message: 'Error retrieving overdue tasks', error: error.message });
    }
};



// GET TASKS DUE TODAY
const getTasksDueToday = async (req, res) => {
    try {
        // Calculate the start and end of the current day
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        // Find tasks with deadlines today that belong to the logged-in user
        const tasks = await Task.find({
            userId: req.user, // Ensure tasks belong to the logged-in user
            deadline: { $gte: today, $lte: endOfToday }, // Filter tasks with deadlines today
        });

        // Respond with a success message and the retrieved tasks
        res.status(200).json({ message: 'Tasks due today retrieved successfully', tasks });
    } catch (error) {
        // Handle any errors that occur during task retrieval
        res.status(500).json({ message: 'Error retrieving tasks due today', error: error.message });
    }
};



// GET UPCOMING TASKS
const getUpcomingTasks = async (req, res) => {
    try {
        // Get the current date and time
        const now = new Date();

        // Find tasks with deadlines after the current date that belong to the logged-in user
        const tasks = await Task.find({
            userId: req.user, // Ensure tasks belong to the logged-in user
            deadline: { $gt: now }, // Filter tasks with deadlines after now
        });

        // Respond with a success message and the retrieved tasks
        res.status(200).json({ message: 'Upcoming tasks retrieved successfully', tasks });
    } catch (error) {
        // Handle any errors that occur during task retrieval
        res.status(500).json({ message: 'Error retrieving upcoming tasks', error: error.message });
    }
};



// UPDATE TASK
const updateTask = async (req, res) => {
    try {
        // Extract the task ID from the request parameters and the updates from the request body
        const { id } = req.params;
        const updates = req.body;

        // Find the task by ID and userId, and apply the updates
        const updatedTask = await Task.findOneAndUpdate(
            { _id: id, userId: req.user }, // Ensure the task belongs to the logged-in user
            updates,
            { new: true } // Return the updated task
        );

        // If the task is not found, respond with an error
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Respond with a success message and the updated task
        res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
    } catch (error) {
        // Handle any errors that occur during task update
        res.status(500).json({ message: 'Error updating task', error: error.message });
    }
};



// DELETE TASK
const deleteTask = async (req, res) => {
    try {
        // Extract the task ID from the request parameters
        const { id } = req.params;

        // Find the task by ID and userId, and delete it
        const deletedTask = await Task.findOneAndDelete({ _id: id, userId: req.user });

        // If the task is not found, respond with an error
        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Respond with a success message and the deleted task
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        // Handle any errors that occur during task deletion
        res.status(500).json({ message: 'Error deleting task', error: error.message });
    }
};




// SEARCH TASKS
const searchTasks = async (req, res) => {
    try {
        // Extract the search query from the request query parameters
        const { query } = req.query;

        // If no query is provided, respond with an error
        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        // Find tasks where the title or description matches the search query (case-insensitive)
        const tasks = await Task.find({
            userId: req.user, // Ensure tasks belong to the logged-in user
            $or: [
                { title: { $regex: query, $options: 'i' } }, // Search in title
                { description: { $regex: query, $options: 'i' } }, // Search in description
            ],
        });

        // Respond with a success message and the retrieved tasks
        res.status(200).json({ message: 'Tasks retrieved successfully', tasks });
    } catch (error) {
        // Handle any errors that occur during task search
        res.status(500).json({ message: 'Error searching tasks', error: error.message });
    }
};




// Export all the controller functions for use in the routes
module.exports = {
    createTask,
    getAllTasks,
    getTasksByDate,
    getTodayTasks,
    getTasksByCategory,
    getOverdueTasks,
    getTasksDueToday,
    getUpcomingTasks,
    updateTask,
    deleteTask,
    searchTasks,
};