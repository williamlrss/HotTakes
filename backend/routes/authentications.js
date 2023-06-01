'use strict';

const authenticationsController = require('../controllers/authentications'); // Importing the authentications controller
const express = require('express'); // Importing Express framework
const router = express.Router(); // Creating a router instance

/**

User routes endpoints
*/
router.post('/login', authenticationsController.loginUser); // Endpoint to handle user login
router.post('/signup', authenticationsController.signupUser); // Endpoint to handle user signup
router.delete('/users/:id', authenticationsController.deleteUser); // Endpoint to handle user deletion
module.exports = router; // Export the router for external use

// Endpoint for authentications: ../server