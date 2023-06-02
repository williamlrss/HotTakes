'use strict';

const authenticationService = require('../services/authentications'); // Importing the authentications service
const logger = require('../utils/winston'); // Importing the Winston logger
require('express-async-errors'); // Importing the async error handling middleware for Express
require('dotenv').config(); // Load environment variables from the .env file

/**

Signs up a new user.
@param {Object} req - The request object.
@param {Object} res - The response object.
*/
const signupUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await authenticationService.createUser(email, password); // Call the authentication service to create a new user
    res.status(201).json(result); // Send a successful response with the result
    logger.info('User signup successful'); // Log the successful user signup
  } catch (error) {
    logger.error('Error in user signup:', error); // Log the error in user signup
    res.status(400).json({ error: error.message }); // Send an error response with the error message
  }
};

/**

Logs in a user.
@param {Object} req - The request object.
@param {Object} res - The response object.
*/
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await authenticationService.loginUser(email, password); // Call the authentication service to log in the user
    res.status(200).json(result); // Send a successful response with the result
    logger.info('User login successful'); // Log the successful user login
  } catch (error) {
    logger.error('Error in user login:', error); // Log the error in user login
    res.status(401).json({ error: error.message }); // Send an error response with the error message
  }
};

/**

Deletes a user.
@param {Object} req - The request object.
@param {Object} res - The response object.
*/
const deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const result = await authenticationService.deleteUser(userId); // Call the authentication service to delete the user
    res.status(200).json(result); // Send a successful response with the result
    logger.info('User deleted successfully'); // Log the successful user deletion
  } catch (error) {
    logger.error('Error in deleting user:', error); // Log the error in user deletion
    res.status(404).json({ error: error.message }); // Send an error response with the error message
  }
};

module.exports = {
  loginUser,
  signupUser,
  deleteUser,
}; // Export the controller functions for external use