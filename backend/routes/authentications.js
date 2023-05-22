'use strict'

const authenticationsController = require('../controllers/authentications');
const express = require('express');
const router = express.Router();

// User login endpoint
router.post('/login', authenticationsController.loginUser);

// User signup endpoint
router.post('/signup', authenticationsController.signupUser);

// Delete user endpoint
router.delete('/users/:id', authenticationsController.deleteUser);

module.exports = router;

// end point for authentications --> ../server