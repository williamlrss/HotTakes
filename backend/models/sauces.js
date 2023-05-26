const mongoose = require('mongoose');
require('mongoose-mongodb-errors');
const uniqueValidator = require('mongoose-unique-validator');
const logger = require('../winston');

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

sauceSchema.plugin(uniqueValidator);

const Sauce = mongoose.model('Sauce', sauceSchema);
logger.info('Sauce model created');

module.exports = Sauce;