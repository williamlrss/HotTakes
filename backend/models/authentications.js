'use strict';

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const logger = require('../winston');

// Mongoose schema for user authentication.
const authenticationSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Apply the uniqueValidator plugin to authenticationSchema
authenticationSchema.plugin(uniqueValidator);

// Log a message when the User model is created
const User = mongoose.model('User', authenticationSchema);
logger.info('User model created');

module.exports = User;