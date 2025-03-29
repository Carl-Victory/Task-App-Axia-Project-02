// Import the User model 
const User = require('../models/usermodel');

// Import the jsonwebtoken library to generate and verify JWT tokens
const jwt = require('jsonwebtoken');

// Import bcryptjs to hash and compare passwords securely
const bcrypt = require('bcryptjs');

// Import a custom function to generate JWT tokens
const jwttoken = require('../jwt/token');




// REGISTER USER
const registerUser = async (req, res) => {
    try {
        // Extract the username, email, and password from the request body
        const { username, email, password } = req.body;

        // Check if a user with the same email already exists in the database
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            // If the email is already in use, return an error response
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Encrypt the password using bcrypt for security
        const salt = await bcrypt.genSalt(10); // Generate a salt for hashing
        const hashedPassword = await bcrypt.hash(password, salt); // Hash the password with the salt

        // Create a new user object with the provided details and the hashed password
        const newUser = new User({ username, email, password: hashedPassword });

        // Save the new user to the database
        await newUser.save();

        // Respond with a success message indicating the user was registered
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        // Handle any errors that occur during registration
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};




// LOGIN USER
const loginUser = async (req, res) => {
    try {
        // Extract the email and password from the request body
        const { email, password } = req.body;

        // Find the user in the database by their email
        const user = await User.findOne({ email });
        if (!user) {
            // If the user is not found, return an error response
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare the provided password with the hashed password stored in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // If the passwords do not match, return an error response
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate a JWT token for the user using their unique ID
        const token = jwttoken(user._id);

        // Remove the password field from the user object before sending it in the response
        const { password: _, ...userdata } = user.toObject();

        // Set the JWT token as an HTTP-only cookie to enhance security
        res.cookie('token', token, { httpOnly: true, samesite: 'strict' });

        // Respond with a success message and the user's data (excluding the password)
        res.status(200).json({ message: 'Login successful', user: userdata });
    } catch (error) {
        // Handle any errors that occur during login
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};



// LOGOUT USER
const logoutUser = async (req, res) => {
    try {
        // Clear the token cookie by setting it to an empty value and setting its expiration to a past date
        res.cookie('token', '', {
            httpOnly: true, // Ensure the cookie is only accessible via HTTP (not JavaScript)
            expires: new Date(0), // Set the cookie to expire immediately
        });

        // Respond with a success message indicating the user has been logged out
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        // Handle any errors that occur during logout
        res.status(500).json({ message: 'Error logging out', error: error.message });
    }
};


// UPDATE USER
const updateUser = async (req, res) => {
    try {
        // Extract the user ID from the authenticated request
        const userId = req.user;

        // Extract the fields to update from the request body
        const updates = req.body;

        // Check if the password is being updated.
        if (updates.password) {
            // Generate a salt and hash the new password.
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(updates.password, salt);
            }

        // Find the user by their ID and apply the updates
        const updatedUser = await User.findByIdAndUpdate(
            userId, // The ID of the user to update
            updates, // The fields to update
            { new: true, runValidators: true } // Return the updated user and validate the updates
        );

        // If the user is not found, return an error response
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Respond with a success message and the updated user details
        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        // Handle any errors that occur during the update process
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};

// Export the updateUser function along with the existing functions
module.exports = { registerUser, loginUser, logoutUser, updateUser };