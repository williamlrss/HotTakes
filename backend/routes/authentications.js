'use strict'

const authenticationsController = require('../controllers/authentications');
const express = require('express');
const router = express.Router();

// User routes endpoints
router.post('/login', authenticationsController.loginUser);
router.post('/signup', authenticationsController.signupUser);
router.delete('/users/:id', authenticationsController.deleteUser);

module.exports = router;

// end point for authentications --> ../server