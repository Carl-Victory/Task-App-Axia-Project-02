// Import the mongoose library to define the schema and interact with the MongoDB database
const mongoose = require('mongoose');


// Define the Task Schema
const taskSchema = new mongoose.Schema({
    title: { 
        type: String, // The title of the task 
        required: true, // This field is mandatory
    },
    description: { 
        type: String, // A detailed description of the task 
    },
    category: { 
        type: String, // The category of the task (e.g., "Work", "Personal")
    },
    deadline: { 
        type: Date, // The deadline for the task 
    },
    isComplete: { 
        type: Boolean, // Indicates whether the task is completed
        default: false, // By default, tasks are incomplete
    },
    isImportant: { 
        type: Boolean, // Indicates whether the task is marked as important
        default: false, // By default, tasks are not marked as important
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, // A reference to the user who created the task
        ref: 'User', // Refers to the User model
        required: true, // This field is mandatory to associate the task with a user
    },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields to the schema


// Export the Task model 
module.exports = mongoose.model('Task', taskSchema);