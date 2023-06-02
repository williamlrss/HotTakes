const winston = require('winston');

const logConfiguration = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6
  },
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/debug.log', level: 'debug' }),
    new winston.transports.File({ filename: 'logs/info.log', level: 'info' }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' })
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' })
  ]
};

const logger = winston.createLogger(logConfiguration);

module.exports = logger;