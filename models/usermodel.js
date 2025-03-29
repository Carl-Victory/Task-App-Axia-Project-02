// Import the mongoose library 
const mongoose = require('mongoose');

// Define the User Schema
const userSchema = new mongoose.Schema({
    username: { 
        type: String, // The username of the user
        required: true, // This field is mandatory
        unique: false, // Each username must be unique
    },
    email: { 
        type: String, // The email address of the user
        required: true, // This field is mandatory
        unique: true, // Each email must be unique
    },
    password: { 
        type: String, // The hashed password of the user
        required: true, // This field is mandatory
    },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields to the schema


// Export the User model so it can be used in other parts of the application
module.exports = mongoose.model('User', userSchema);