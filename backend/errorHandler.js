const logger = require('./winston');

const errorHandler = (err, req, res, next) => {
  logger.error('An error occurred:', err);
  res.status(500).json({ error: 'Internal Server Error' });
};

module.exports = errorHandler;