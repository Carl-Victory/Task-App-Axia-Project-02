// Import the Router object from the Express library to define routes
const { Router } = require('express');

// Import the controller functions for user registration and login
// These functions handle the logic for registering and logging in users
const { registerUser, loginUser, logoutUser, updateUser } = require('../controllers/usercontroller');

// Create a new router object to define user-related routes
const userRouter = Router();

// Import the authentication middleware to protect the route
const authMiddleware = require('../middlewares/authmiddleware');



// Define the route for user registration
// This route allows new users to create an account
userRouter.post('/register', registerUser);

// Define the route for user login
// This route allows existing users to log in and receive a token
userRouter.post('/login', loginUser);

// Define the route for updating user details
// This route allows authenticated users to update their profile details
userRouter.put('/update', authMiddleware, updateUser);

// Define the route for user logout
// This route allows users to log out by clearing their authentication token
userRouter.post('/logout', logoutUser);

// Export the userRouter object so it can be used in the main server file
module.exports = userRouter;