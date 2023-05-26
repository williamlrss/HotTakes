const winston = require('winston');
const logConfig = require('./config');

const logger = winston.createLogger(logConfig);

module.exports = logger;