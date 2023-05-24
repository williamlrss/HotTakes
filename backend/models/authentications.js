'use strict'

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


// Mongoose schema for user authentication.

const authenticationSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Apply the uniqueValidator plugin to userSchema
authenticationSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', authenticationSchema);

// Next route --> ../services/authentications