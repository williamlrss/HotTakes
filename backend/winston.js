const winston = require('winston');

const logger = winston.createLogger({
  level: 'info', // Set the log level (e.g., error, warn, info, debug)
  format: winston.format.simple(), // Use a simple log format
  transports: [
    new winston.transports.Console(), // Output logs to the console
    new winston.transports.File({ filename: 'app.log' }), // Output logs to a file
  ],
});

module.exports = logger;