'use strict';

const express = require('express'); // Importing Express framework
const logger = require('./utils/winston')
const rateLimit = require('express-rate-limit'); // Importing rate limiting middleware for Express
const path = require('path'); // Importing the path module
const cors = require('cors'); // Importing the CORS middleware
const helmet = require('helmet'); // Importing the Helmet middleware for security headers
const xss = require('xss-clean'); // Importing the xss-clean middleware to sanitize user input
const hpp = require('hpp'); // Importing the hpp middleware to protect against HTTP parameter pollution
require('express-async-errors'); // Importing the async error handling middleware for Express

/**

Create Express app
*/
const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

/**

Apply content security policy using Helmet middleware
*/
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      'default-src': ["'self'"], // Allow resources from the same origin
      'img-src': ["'self'", "data:", "http://localhost:3000"], // Allow images from the same origin, data URIs, and localhost:3000
    },
  })
);
app.use(xss()); // Apply xss-clean middleware to sanitize user input
app.use(hpp()); // Apply hpp middleware to protect against HTTP parameter pollution

/**

Middleware to limit the amount of requests
*/
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Maximum 100 requests per windowMs
});
app.use(limiter);
// Routes
const authenticationsRouter = require('./routes/authentications'); // Importing the authentication routes
const saucesRouter = require('./routes/sauces'); // Importing the sauces routes
app.use('/api/auth', authenticationsRouter); // Register authentication routes
app.use('/api/sauces', saucesRouter); // Register sauces routes
app.use('/images', express.static(path.join(__dirname, 'images'))); // Serve static files from the 'images' directory

/**

Error handling middleware
*/
app.use((err, req, res, next) => {
  logger.error('An error occurred:', err); // Logging the error
  res.status(500).json({ error: 'Issues from our server, please refresh the page and try again' }); // Sending an Internal Server Error response
});

module.exports = app; // Export the Express app for external use