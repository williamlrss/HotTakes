'use strict'

const mongoose = require('mongoose');


/**

Mongoose schema for user authentication.
*/

const authenticationSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model('User', authenticationSchema);

// Next route --> ../services/authentications