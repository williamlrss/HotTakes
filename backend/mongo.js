'use strict';

const mongoose = require('mongoose'); // Importing Mongoose for MongoDB interaction
const logger = require('./utils/winston'); // Importing the Winston logger
const dotenv = require('dotenv'); // Importing dotenv for environment variable configuration
require('express-async-errors'); // Importing the async error handling middleware for Express

dotenv.config(); // Load environment variables from the .env file

/**

Function to connect to the MongoDB database
*/
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.URL_MONGO_DB);

    const collections = mongoose.connection.collections;
    const collectionNames = Object.keys(collections);
    
    logger.info(`Connected to Atlas Mongo_Db | name: HOT-TAKES | collections: ${collectionNames.join(', ')}`);
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB; // Export the connectDB function for external use