// Import the Express library to create the server and handle routes
const express = require('express');

// Import the Mongoose library to interact with the MongoDB database
const mongoose = require('mongoose');

// Import the cookie-parser middleware to parse cookies in incoming requests
const cookieParser = require('cookie-parser');

// Import the function to connect to the MongoDB database
const connectDB = require('./database/mongodb');

// Import the user-related routes
const userRouter = require('./routers/userroutes');

// Import the task-related routes
const taskRouter = require('./routers/taskroutes');

// Create an instance of the Express application
const app = express();

// Load environment variables from the .env file
require('dotenv').config();

// Retrieve the port number from the environment variables
const port = process.env.PORT;



// Middleware to parse incoming JSON requests
app.use(express.json());

// Middleware to parse URL-encoded data (e.g., form submissions)
app.use(express.urlencoded({ extended: true }));

// Middleware to parse cookies in incoming requests
app.use(cookieParser());



// Define the route for user-related actions (e.g., registration, login)
// All routes starting with '/api/user' will be handled by the userRouter
app.use('/api/user', userRouter);

// Define the route for task-related actions (e.g., creating, retrieving tasks)
// All routes starting with '/api/task' will be handled by the taskRouter
app.use('/api/task', taskRouter);



// Connect to the MongoDB database
connectDB();

// Define a simple route to test if the server is running
// When a user visits the root URL ('/'), they will see a welcome message
app.get('/', (req, res) => {
    res.send('Welcome to my Task Manager API');
});

// Start the server and listen on the specified port
// Log a message to the console to confirm the server is running
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});