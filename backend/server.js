'use strict';

const express = require('express');
const rateLimit = require('express-rate-limit');
const path = require('path');
const cors = require('cors');
const connectDB = require('./mongo');
const logger = require('./winston');
const errorHandler = require('./errorHandler');
const authenticationsRouter = require('./routes/authentications');
const saucesRouter = require('./routes/sauces');
require('express-async-errors');

// Create Express app
const app = express();
app.use(cors());

// Middleware
app.use(express.json());
app.use(express.static('./public/uploads/sauces'));

// Middleware to limit the amount of requests
const limiter = rateLimit({
windowMs: 15 * 60 * 1000, // 15 minutes
max: 100, // maximum 100 requests
});
app.use(limiter);

// Routes
app.use('/api/auth', authenticationsRouter); // Authentication routes
app.use('/api/sauces', saucesRouter); // Sauce routes
app.use('/images', express.static(path.join(__dirname, 'images'))); // Serve static images

// Error handling middleware
app.use(errorHandler);

// Start server
const startServer = async () => {
try {
await connectDB();
const port = process.env.PORT || 3000;
app.listen(port, () => {
logger.info(`Server started on port ${port}`);
});
} catch (error) {
logger.error('Failed to start the server:', error);
process.exit(1);
}
};

startServer();

module.exports = app;