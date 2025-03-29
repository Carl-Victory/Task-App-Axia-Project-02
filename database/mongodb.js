// Import the mongoose library to interact with the MongoDB database
const mongoose = require('mongoose');

// Load variables from the .env file
require('dotenv').config();


// Define an asynchronous function to connect to the MongoDB database
const connectDB = async () => {
    try {
        // Use mongoose to connect to the MongoDB database using the connection string from the .env file
        await mongoose.connect(process.env.MONGO_URI); 

        // If the connection is successful, log a success message to the console
        console.log('MongoDB connected');
    } catch (err) {
        // If there is an error during the connection, log the error message to the console
        console.error(err.message);
    }
};


// Export the connectDB function so it can be used in other parts of the application
module.exports = connectDB;