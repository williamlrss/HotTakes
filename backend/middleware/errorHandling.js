const logger = require('../utils/winston');

const errorHandling = (app) => {
	app.use((err, req, res, next) => {
		logger.error('async errors:', err);
		res.status(500).json({
			error: 'Issues from our server, please refresh the page and try again',
		});
	});
};

module.exports = errorHandling;
