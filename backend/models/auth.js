'use strict';

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const logger = require('../utils/winston');

const authenticationSchema = mongoose.Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
});
authenticationSchema.plugin(uniqueValidator);

const User = mongoose.model('User', authenticationSchema);
logger.info('User model created');

module.exports = User;
