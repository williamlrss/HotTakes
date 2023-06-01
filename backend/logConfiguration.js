// const winston = require('winston'); // Importing Winston logger
// const transport = './'
// require('winston-daily-rotate-file'); // Importing Winston daily rotate file transport

// /**

// Configuration for Winston logger based on environment
// */
// // const logConfiguration = {
// //   development: {
// //     level: 'debug', // Logging level for development
// //     format: winston.format.combine(
// //       winston.format.colorize(), // Add colorization to log output
// //       winston.format.simple() // Use simple log format
// //     ),
// //     transports: [
// //       new winston.transports.Console(), // Log to the console
// //       new winston.transports.File({ filename: './app.log' }), // Log to a file
// //     ],
// //   },
// //   production: {
// //     level: 'info', // Logging level for production
// //     format: winston.format.combine(
// //       // winston.format.timestamp(), // Add timestamp to log entries
// //       winston.format.json() // Use JSON log format
// //     ),
// //     transports: [
// //       new winston.transports.File({ filename: 'logs/app.log' }), // Log to a file
// //       new winston.transports.DailyRotateFile({ filename: 'logs/app-%DATE%.log', datePattern: 'YYYY-MM-DD' }), // Rotate logs daily
// //     ],
// //     exceptionHandlers: [
// //       new winston.transports.File({ filename: 'logs/exceptions.log' }), // Log exceptions to a separate file
// //     ],
// //   },
// // };


// const logConfiguration = {
//   development: {
//     levels: {
//       error: 0,
//       warn: 1,
//       info: 2,
//       http: 3,
//       verbose: 4,
//       debug: 5,
//       silly: 6
//     },
//     format: winston.format.combine(
//       winston.format.colorize(),
//       winston.format.simple()
//     ),
//     transports: [
//       new winston.transports.Console(),
//       new DailyRotateFile({
//         filename: 'logs/debug-%DATE%.log',
//         level: 'debug',
//         datePattern: 'YYYY-MM-DD',
//         zippedArchive: true,
//         maxSize: '20m',
//         maxFiles: '14d'
//       }),
//       new DailyRotateFile({
//         filename: 'logs/info-%DATE%.log',
//         level: 'info',
//         datePattern: 'YYYY-MM-DD',
//         zippedArchive: true,
//         maxSize: '20m',
//         maxFiles: '14d'
//       }),
//       new DailyRotateFile({
//         filename: 'logs/error-%DATE%.log',
//         level: 'error',
//         datePattern: 'YYYY-MM-DD',
//         zippedArchive: true,
//         maxSize: '20m',
//         maxFiles: '14d'
//       })
//     ],
//     exceptionHandlers: [
//       new DailyRotateFile({
//         filename: 'logs/exceptions-%DATE%.log',
//         datePattern: 'YYYY-MM-DD',
//         zippedArchive: true,
//         maxSize: '20m',
//         maxFiles: '14d'
//       })
//     ],
//     exceptionHandlers: [
//       new winston.transports.File({ filename: 'logs/exceptions.log' })
//     ]
//   },
//   production: {
//     levels: {
//       error: 0,
//       warn: 1,
//       info: 2,
//       http: 3,
//       verbose: 4,
//       debug: 5,
//       silly: 6
//     },
//     format: winston.format.combine(
//       winston.format.json()
//     ),
//     transports: [
//       new winston.transports.Console(),
//       new winston.transports.File({ filename: 'logs/info.log', level: 'info' }),
//       new winston.transports.File({ filename: 'logs/error.log', level: 'error' })
//     ],
//     exceptionHandlers: [
//       new winston.transports.File({ filename: 'logs/exceptions.log' })
//     ]
//   }
// };

// module.exports = logConfiguration[process.env.NODE_ENV || 'development']; // Export the log configuration based on the current environment