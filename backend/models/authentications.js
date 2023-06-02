'use strict';

const mongoose = require('mongoose'); // Importing mongoose for MongoDB interactions
const uniqueValidator = require('mongoose-unique-validator'); // Importing mongoose-unique-validator for unique field validation
const bcrypt = require('bcrypt'); // Importing bcrypt for password hashing
const logger = require('../utils/winston'); // Importing the Winston logger

/**

Mongoose schema for user authentication.
*/
const authenticationSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
// Apply the uniqueValidator plugin to authenticationSchema
authenticationSchema.plugin(uniqueValidator);

/**

Generates a salt for password hashing before saving.
@param {number} rounds - The number of rounds for the salt generation.
@returns {Promise<string>} A promise that resolves to the generated salt.
*/
authenticationSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Log a message when the User model is created
const User = mongoose.model('User', authenticationSchema);
logger.info('User model created');

module.exports = User; // Export the User model for external use