// Import the Router object from the Express library to define routes
const { Router } = require('express');

// Import all the task-related controller functions
const {
    createTask, // Handles creating a new task
    getAllTasks, // Retrieves all tasks for the logged-in user
    getTasksByDate, // Retrieves tasks created on a specific date
    getTodayTasks, // Retrieves tasks created today
    updateTask, // Updates a specific task
    deleteTask, // Deletes a specific task
    getTasksByCategory, // Retrieves tasks by category
    getOverdueTasks, // Retrieves tasks that are overdue
    getTasksDueToday, // Retrieves tasks that are due today
    getUpcomingTasks, // Retrieves tasks with upcoming deadlines
    searchTasks, // Searches tasks by title or description
} = require('../controllers/taskcontroller');

// Import the authentication middleware to protect routes
// This middleware ensures that only authenticated users can access the routes
const authMiddleware = require('../middlewares/authmiddleware');

// Create a new router object to define task-related routes
const taskRouter = Router();



// Define the route for creating a new task
taskRouter.post('/create', authMiddleware, createTask);

// Define the route for retrieving all tasks for the logged-in user
taskRouter.get('/all', authMiddleware, getAllTasks);

// Define the route for retrieving tasks created on a specific date
// The date is passed as a parameter in the URL
taskRouter.get('/date/:date', authMiddleware, getTasksByDate);

// Define the route for retrieving tasks created today
taskRouter.get('/today', authMiddleware, getTodayTasks);

// Define the route for retrieving tasks by category
// The category is passed as a parameter in the URL
taskRouter.get('/category/:category', authMiddleware, getTasksByCategory);

// Define the route for retrieving overdue tasks
// These are tasks with deadlines before the current date
taskRouter.get('/overdue', authMiddleware, getOverdueTasks);

// Define the route for retrieving tasks that are due today
taskRouter.get('/due-today', authMiddleware, getTasksDueToday);

// Define the route for retrieving tasks with upcoming deadlines
taskRouter.get('/upcoming', authMiddleware, getUpcomingTasks);

// Define the route for updating a specific task
// The task ID is passed as a parameter in the URL
taskRouter.put('/update/:id', authMiddleware, updateTask);

// Define the route for deleting a specific task
// The task ID is passed as a parameter in the URL
taskRouter.delete('/delete/:id', authMiddleware, deleteTask);

// Define the route for searching tasks by title or description
// The search query is passed as a query parameter in the URL
taskRouter.get('/search', authMiddleware, searchTasks);

// Export the taskRouter object so it can be used in the main server file
module.exports = taskRouter;