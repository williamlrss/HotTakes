const mongoose = require('mongoose');
const Sauce = require('../models/sauce');
const fsPromises = require('fs').promises;
const logger = require('../utils/winston');

const getAllSauces = async () => {
	return await Sauce.find();
};

const getOneSauce = async (id) => {
	if (!mongoose.Types.ObjectId.isValid(id)) {
		throw new Error('Invalid ID format');
	}
	return await Sauce.findById(id);
};

const createSauce = async (sauceData, imageUrl) => {
	try {
		const userId = sauceData.userId;

		if (!userId) {
			throw new Error('User ID is required');
		}

		const sauce = new Sauce({
			...sauceData,
			imageUrl,
		});

		return await sauce.save();
	} catch (error) {
		logger.error('In createSauce service: ', error);
		throw error;
	}
};

const updateSauce = async (id, userId, sauceData, imageUrl) => {
	try {
		if (!mongoose.Types.ObjectId.isValid(id)) {
			throw new Error('Invalid ID format');
		}
		const sauce = await Sauce.findById(id);

		if (!sauce) {
			throw new Error('Sauce not found');
		} else if (sauce.userId.toString() !== userId) {
			throw new Error('Wrong user for this sauce');
		} else if (imageUrl) {
			const filename = sauce.imageUrl.split('/').pop();
			await fsPromises.unlink(`images/${filename}`);
			sauce.imageUrl = imageUrl;
		}
		Object.assign(sauce, sauceData);
		return await sauce.save();
	} catch (error) {
		throw error;
	}
};

const deleteSauce = async (id) => {
	try {
		if (!mongoose.Types.ObjectId.isValid(id)) {
			throw new Error('Invalid ID format');
		}

		const sauce = await Sauce.findById(id);

		const fileName = sauce.imageUrl.split('/').pop();
		await fsPromises.unlink(`images/${fileName}`);

		return await sauce.deleteOne();

		/**
		 * Result:
		 * Database function: sauce found by id
		 * Promise: delete image from images folder
		 * Database function: delete sauce
		 */
	} catch (error) {
		throw error;
	}
};

const likeSauce = async (id, like, userId) => {
	try {
		if (!mongoose.Types.ObjectId.isValid(id)) {
			throw new Error('Invalid ID format');
		}

		const sauce = await Sauce.findById(id);

		if (!sauce || !sauce.usersLiked || !sauce.usersDisliked) {
			throw new Error('Sauce not found');
		} else if (isNaN(like) || like > 1 || like < -1) {
			throw new Error('Invalid like value');
		}

		// const { usersLiked, usersDisliked } = sauce;

		if (
			like === 1 &&
			!sauce.usersLiked.includes(userId) &&
			!sauce.usersDisliked.includes(userId)
		) {
			sauce.usersLiked.addToSet(userId);
		} else if (
			like === -1 &&
			!sauce.usersDisliked.includes(userId) &&
			!sauce.usersLiked.includes(userId)
		) {
			sauce.usersDisliked.addToSet(userId);
		} else if (like === 0 && sauce.usersLiked.includes(userId)) {
			sauce.usersLiked.pull(userId);
		} else if (like === 0 && sauce.usersDisliked.includes(userId)) {
			// line 114
			sauce.usersDisliked.pull(userId);
		}

		sauce.likes = sauce.usersLiked.length;
		sauce.dislikes = sauce.usersDisliked.length;
		// console.log(sauce);
		return await sauce.save();

		/**
		 * Result for one user:
		 * Database function: sauce found by id
		 *
		 * Where 'like' represent the click to like or dislike button:
		 *    like, sauce.likes, usersLikes, sauce.dislikes, userDisliked
		 *	  like = 1		 1 1 [ '6483205da9349c7e295fc580' ] 0 []
		 * 	  like = 0		 0 0 [] 0 []
		 * 	  like = -1		 -1 0 [] 1 [ '6483205da9349c7e295fc580' ]
		 *
		 * Database function: save updated sauce
		 */
	} catch (error) {
		logger.error('In likeSauce service: ', error);
		throw error;
	}
};

module.exports = {
	getAllSauces,
	getOneSauce,
	createSauce,
	updateSauce,
	deleteSauce,
	likeSauce,
}; // towards sauceController
