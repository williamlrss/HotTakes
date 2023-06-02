
'use strict';

const User = require('../models/authentications'); // Importing the User model
const bcrypt = require('bcrypt'); // Importing bcrypt for password hashing
const jwt = require('jsonwebtoken'); // Importing jsonwebtoken for authentication tokens
const logger = require('../utils/winston'); // Importing the Winston logger
require('express-async-errors'); // Importing the async error handling middleware for Express
require('dotenv').config(); // Load environment variables from the .env file
const validator = require('validator'); // Importing the validator library for input validation

/**

Signs up a new user with the provided email and password.
@param {string} email - The user's email.
@param {string} password - The user's password.
@returns {Object} An object containing a success message.
@throws {Error} If the email already exists or has an invalid format.
*/
const createUser = async (email, password) => {
    try {
        const existingUser = await User.findOne({ email }); // Check if the email already exists
        if (existingUser) {
            throw new Error('Email already exists');
        }
        if (!validator.isEmail(email)) {
            throw new Error('Invalid email format');
        }
        if (!validator.isStrongPassword(password)) {
            throw new Error(
                'The password must contain 8 digits, one uppercase letter and a special characters'
            );
        }
        const newUser = new User({ email, password }); // Create a new user instance
        await newUser.save(); // Save the new user to the database
        return { message: 'User registration successful' };
    } catch (error) {
        logger.error('Error in createUser:', error);
        throw error;
    }
};

/**

Logs in a user with the provided email and password.
@param {string} email - The user's email.
@param {string} password - The user's password.
@returns {Object} An object containing the user ID and authentication token.
@throws {Error} If the email or password is invalid.
*/
const loginUser = async (email, password) => {
    try {
        const user = await User.findOne({ email }); // Find the user by email
        if (!user) {
            throw new Error('Invalid email or password');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password); // Compare the provided password with the hashed password in the database
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
            expiresIn: '1h',
        }); // Generate a JWT token for authentication
        return { userId: user._id, token };
    } catch (error) {
        logger.error('Error in loginUser:', error);
        throw error;
    }
};

/**

Deletes a user with the specified user ID.
@param {string} userId - The ID of the user to delete.
@returns {Object} An object containing a success message.
@throws {Error} If the user is not found.
*/
const deleteUser = async (userId) => {
    try {
        const user = await User.findById(userId); // Find the user by ID
        if (!user) {
            throw new Error('User not found');
        }
        await User.findByIdAndDelete(userId); // Delete the user from the database
        return { message: 'User deleted successfully' };
    } catch (error) {
        logger.error('Error in deleteUser:', error);
        throw error;
    }
};

module.exports = {
    loginUser,
    createUser,
    deleteUser,
}; // Export the authentication service functions for external use