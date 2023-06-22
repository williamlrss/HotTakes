const logger = require('../utils/winston');
const sauceService = require('../services/sauce');
const mongoose = require('mongoose');

const getAllSaucesController = async (req, res) => {
	try {
		const sauces = await sauceService.getAllSauces(); // Call the logic and validation function
		res.status(200).json(sauces); // OK
	} catch (error) {
		logger.error('in getAllSauces:', error);
		res.status(500).json({ error: 'Server error or route misconfiguration' }); // Internal Server Error
	}
};

const getOneSauceController = async (req, res) => {
	try {
		const sauce = await sauceService.getOneSauce(req.params.id); // Find sauce by id
		if (!sauce) {
			throw new Error('Sauce not found');
		}
		res.status(200).json(sauce); // OK
	} catch (error) {
		next(error);
	}
};

const createSauceController = async (req, res) => {
	try {
		if (!req.file) {
			throw new Error('Image file is required');
		}

		const sauceData = JSON.parse(req.body.sauce);
		const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`; // Set the image file destination
		const sauce = await sauceService.createSauce(sauceData, imageUrl); // Call the logic and validation function
		res.status(201).json(sauce); // Created
	} catch (error) {
		logger.error('In createSauce controller', error);
		if (
			error instanceof mongoose.Error.ValidationError || // Most likely refering to invalid provided sauceData
			error.message === 'Image file is required'
		) {
			res.status(400).json({ error: error.message }); // Bad request
		} else if (error.message === 'User ID is required') {
			res.status(401).json({ error: error.message }); // Unauthorized
		} else {
			res.status(500).json({ error: 'Server error or route misconfiguration' }); // Internal Server Error
		}
	}
};

const updateSauceController = async (req, res) => {
	try {
		const sauceData = req.body;
		let imageUrl;

		if (req.file) {
			imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
		}
		await sauceService.updateSauce(req.params.id, req.auth.userId, sauceData, imageUrl); // Call the logic and validation function
		res.status(200).json({ message: 'Sauce updated' }); // OK
	} catch (error) {
		logger.error('Error in updateSauce:', error);
		if (
			error instanceof mongoose.Error.ValidationError || // Most likely refering to invalid provided sauceData
			error.message === 'Invalid ID format'
		) {
			res.status(400).json({ error: error.message }); // Bad request
		} else if (error.message === 'Wrong user for this sauce') {
			res.status(403).json({ error: error.message }); // Forbidden
		} else if (error.message === 'Sauce not found') {
			res.status(404).json({ message: error.message }); // Not found
		} else {
			res.status(500).json({ error: 'Server error or route misconfiguration' }); // Internal server error
		}
	}
};

const deleteSauceController = async (req, res) => {
	try {
		const sauce = await sauceService.getOneSauce(req.params.id); // Find sauce by id

		if (!sauce) {
			throw new Error('Sauce not found');
		}

		if (req.auth.userId !== sauce.userId) {
			throw new Error('Wrong user for this sauce');
		}

		await sauceService.deleteSauce(req.params.id); // Call the logic and validation function
		res.status(200).json({ message: 'Sauce deleted' }); // OK
	} catch (error) {
		logger.error(error.message);
		if (error.message === 'Invalid ID format') {
			res.status(400).json({ error: error.message }); // Bad request
		} else if (error.message === 'Wrong user for this sauce') {
			res.status(403).json({ error: error.message }); // Forbidden
		} else if (error.message === 'Sauce not found') {
			res.status(404).json({ error: error.message }); // Not found
		} else {
			res.status(500).json({ error: 'Server error or route misconfiguration' }); // Internal server error
		}
	}
};

const likeSauceController = async (req, res) => {
	try {
		const { like, userId } = req.body;

		await sauceService.getOneSauce(req.params.id); // Find sauce by id

		await sauceService.likeSauce(req.params.id, like, userId); // Call the logic and validation function

		res.status(200).json({ message: 'Like/dislike updated!' }); // OK
	} catch (error) {
		logger.error('Error in likeSauce: ', error);
		if (error.message === 'Invalid ID format' || error.message === 'Invalid like value') {
			res.status(400).json({ error: error.message }); // Bad request
		} else if (error.message === 'Sauce not found') {
			res.status(404).json({ error: error.message }); // Not found
		} else {
			res.status(500).json({ error: 'Server error or route misconfiguration' }); // Internal server error
		}
	}
};

module.exports = {
	getAllSaucesController,
	getOneSauceController,
	createSauceController,
	updateSauceController,
	deleteSauceController,
	likeSauceController,
}; // towards sauceRoutes
