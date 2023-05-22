const express = require('express');
const router = express.Router();
const authenticationsController = require('../controllers/authentications');

// User login endpoint
router.post('/login', authenticationsController.loginUser);

// User signup endpoint
router.post('/signup', authenticationsController.signupUser);

// Delete user endpoint
router.delete('/users/:id', authenticationsController.deleteUser);

module.exports = router;