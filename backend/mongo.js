'use strict';

const mongoose = require('mongoose');
const logger = require('./winston');
const dotenv = require('dotenv');
require('express-async-errors');

dotenv.config();

// Connect to the MongoDB database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.URL_MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('Connected to Atlas-Mongo_Database');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;