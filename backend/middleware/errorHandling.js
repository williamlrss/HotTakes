const logger = require('../utils/winston');
const mongoose = require('mongoose');

const errorHandling = (err, req, res, next) => {
	let statusCode;
	let message;

	if (err.message === 'Image file is required' || err.message === 'Invalid like value') {
		statusCode = 400;
		message = err.message;
	} else if (err.message === 'User ID is required') {
		statusCode = 401;
		message = 'Authentication failed';
	} else if (err.message === 'Wrong user for this sauce') {
		statusCode = 403;
		message = err.message;
	} else if (err.message === 'Invalid ID format' || err.message === 'Sauce not found') {
		statusCode = 404;
		message = 'Sauce not found';
	} else if (
		err.message.includes('Sauce validation failed') ||
		err instanceof mongoose.Error.ValidationError
	) {
		statusCode = 422;
		message = 'Invalid provided ressources';
	} else {
		res.status(500).json({ error: 'Server error, please try again later' });
	}

	logger.error(err);
	res.status(statusCode).json({ error: message });
};

module.exports = errorHandling;
