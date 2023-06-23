'use strict';

const express = require('express');
const appMiddlewares = require('./middleware/appMiddlewares');
const errorHandling = require('./middleware/errorHandling');
const path = require('path');

const authenticationsRouter = require('./routes/auth');
const saucesRouter = require('./routes/sauce');

const app = express();

appMiddlewares(express, app);

app.use('/api/auth', authenticationsRouter); // Register authentication routes
app.use('/api/sauces', saucesRouter); // Register sauces routes
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(errorHandling); // Register error handling middleware

module.exports = app; // Export the Express app for external use
