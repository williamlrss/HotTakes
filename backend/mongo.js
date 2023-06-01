'use strict';

const mongoose = require('mongoose'); // Importing Mongoose for MongoDB interaction
const logger = require('./winston'); // Importing the Winston logger
const dotenv = require('dotenv'); // Importing dotenv for environment variable configuration
require('express-async-errors'); // Importing the async error handling middleware for Express

dotenv.config(); // Load environment variables from the .env file

/**

Function to connect to the MongoDB database
*/
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.URL_MONGO_DB);
    logger.info('Connected to Atlas-Mongo_Database');

    const databaseName = mongoose.connection.name;
    const collections = mongoose.connection.collections;

    console.log('Database Name:', databaseName);

    for (const collectionName in collections) {
      console.log(`Acquired collection: ${collectionName}`);
    }
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB; // Export the connectDB function for external use