// Import the jsonwebtoken library to generate and verify JWT tokens
const jwt = require('jsonwebtoken');

// Load environment variables from the .env 
require('dotenv').config();

// Define a function to generate a JWT token
// This function takes a user's unique ID as input and returns a signed JWT token
const jwttoken = (id) => {
    return jwt.sign(
        { id }, // The payload of the token, which IS the user's unique ID
        process.env.JWT_SECRET, // The secret key used to sign the token (stored in the .env file)
        {
            expiresIn: '30d', // The token will expire in 1 day
        }
    );
};

// Export the jwttoken function
module.exports = jwttoken;