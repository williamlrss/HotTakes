'use strict';

const app = require('./app'); // Importing the Express application
const logger = require('./utils/winston'); // Importing the Winston logger
const connectDB = require('./mongo'); // Importing the database connection utility
require('express-async-errors'); // Importing the async error handling middleware for Express

/**

Function to start the server
*/
const startServer = async () => {
    try {
        await connectDB(); // Connecting to the database
        const port = process.env.PORT || 3000; // Setting the port for the server
        app.listen(port, () => logger.info(`Server started on port ${ port }`)); // Starting the server
    } catch (error) {
        logger.error('Failed to start the server:', error); // Logging the error if server startup fails
        process.exit(1); // Exiting the process with a failure code
    }
};
startServer().catch((error) => {
    logger.error('An unhandled error occurred during server startup:', error); // Logging the unhandled error during server startup
    process.exit(1); // Exiting the process with a failure code
});