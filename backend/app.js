'use strict';

const express = require('express');
const rateLimit = require('express-rate-limit');
const path = require('path');
const cors = require('cors');
const connectDB = require('./mongo');
require('express-async-errors');

// Create Express app
const app = express();
app.use(cors());

// Middleware
app.use(express.json());
app.use(express.static('./public/uploads/sauces'));

// Middleware to limit the amount of requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Routes
const authenticationsRouter = require('./routes/authentications');
const saucesRouter = require('./routes/sauces');
app.use('/api/auth', authenticationsRouter);
app.use('/api/sauces', saucesRouter);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;