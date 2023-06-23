const logger = require('../utils/winston');

const errorHandling = (err, req, res, next) => {
	let statusCode;
	let message;

	if (
		err.message === 'Invalid ID format' ||
		err.message === 'Image file is required' ||
		err.message === 'Image file is required' ||
		err.message === 'Invalid like value'
	) {
		statusCode = 400;
		message = err.message;
	} else if (err.message === 'User ID is required') {
		statusCode = 401;
		message = err.message;
	} else if (err.message === 'Wrong user for this sauce') {
		statusCode = 403;
		message = err.message;
	} else if (err.message === 'Sauce not found') {
		statusCode = 404;
		message = err.message;
	} else if (
		err.message.includes('Sauce validation failed') ||
		err instanceof mongoose.Error.ValidationError
	) {
		statusCode = 422;
		message = 'Invalid provided ressources';
	} else {
		statusCode = 500;
		message = 'Server error or route misconfiguration';
	}

	logger.error(err);
	res.status(statusCode).json({ error: message });
};

module.exports = errorHandling;
