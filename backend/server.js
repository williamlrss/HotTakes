'use strict';

const app = require('./app');
const logger = require('./winston');
const connectDB = require('./mongo');
require('express-async-errors');

const startServer = async () => {
    try {
        await connectDB();
        const port = process.env.PORT || 3000;
        app.listen(port, () => logger.info(`Server started on port ${port}`));
    } catch (error) {
        logger.error('Failed to start the server:', error);
        process.exit(1);
    }
};

startServer().catch((error) => {
    logger.error('An unhandled error occurred during server startup:', error);
    process.exit(1);
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error('An error occurred:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});