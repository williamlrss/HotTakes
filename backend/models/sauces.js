const mongoose = require('mongoose'); // Importing mongoose for MongoDB interactions
const uniqueValidator = require('mongoose-unique-validator'); // Importing mongoose-unique-validator for unique field validation
const logger = require('../winston'); // Importing the Winston logger

/**

Mongoose schema for user authentication.
*/
const sauceSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    usersLiked: { type: [String], default: [] },
    usersDisliked: { type: [String], default: [] },
  },
  { timestamps: true }
);

sauceSchema.plugin(uniqueValidator); // Ensure fields do not have duplicate

const Sauce = mongoose.model('Sauce', sauceSchema);
logger.info('Sauce model created');

module.exports = Sauce;