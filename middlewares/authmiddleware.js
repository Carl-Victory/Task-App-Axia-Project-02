// Import the jsonwebtoken library to verify JWT tokens
const jwt = require('jsonwebtoken');

// Load environment variables from the .env file
require('dotenv').config();

// Import the User model from the models/usermodel.js file
const User = require('../models/usermodel');




// Define the authentication middleware function
const authMiddleware = async (req, res, next) => {
    // Retrieve the token from cookies or the Authorization header
    const token = req.cookies.token || req.header('Authorization');

    // If no token is provided, return an error response
    if (!token) {
        return res.status(401).json({ message: 'Please login to continue' }); // Token not found
    }

    try {
        // Verify the token using the secret key from the .env file
        const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);

        // If the token is invalid, return an error response
        if (!verifiedToken) {
            return res.status(403).json({ message: 'Invalid token' }); // Return if token is invalid
        }

        // Find the user in the database using the ID from the verified token
        // Exclude the password field from the retrieved user object
        const user = await User.findById(verifiedToken.id).select('-password');

        // If the user is not found, return an error response
        if (!user) {
            return res.status(404).json({ message: 'User not found' }); // Return if user is not found
        }

        // Attach the user object to the request object for use in subsequent middleware or route handlers
        req.user = user;

        // Call the next middleware or route handler
        next();
    } catch (error) {
        // Log the error to the console for debugging
        console.error(error);

        // Return a server error response
        res.status(500).json({ message: 'Server error' });
    }
};


// Export the authMiddleware function so it can be used in protected routes
module.exports = authMiddleware;