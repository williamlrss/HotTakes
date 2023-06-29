const logger = require('../utils/winston');
const sauceService = require('../services/sauce');
require('mongoose');

const getAllSaucesController = async (req, res, next) => {
	try {
		const sauces = await sauceService.getAllSauces(); // Call the logic and validation function

		res.status(200).json(sauces); // OK
	} catch (error) {
		logger.error(error);
		next(error);
	}
};

const getOneSauceController = async (req, res, next) => {
	try {
		const sauce = await sauceService.getOneSauce(req.params.id); // Find sauce by id

		if (!sauce) {
			throw new Error('Sauce not found');
		}

		res.status(200).json(sauce); // OK
	} catch (error) {
		logger.error(error);
		next(error);
	}
};

const createSauceController = async (req, res, next) => {
	try {
		const sauceData = JSON.parse(req.body.sauce);

		const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`; // Set the image file destination

		const sauce = await sauceService.createSauce(sauceData, imageUrl); // Call the logic and validation function

		res.status(201).json(sauce); // Created
	} catch (error) {
		logger.error(error);
		next(error);
	}
};

const updateSauceController = async (req, res, next) => {
	try {
		const sauceData = req.body;
		let imageUrl;

		if (req.file) {
			imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
		}

		await sauceService.updateSauce(req.params.id, req.auth.userId, sauceData, imageUrl); // Call the logic and validation function

		res.status(200).json({ message: 'Sauce updated' }); // OK
	} catch (error) {
		logger.error(error);
		next(error);
	}
};

const deleteSauceController = async (req, res, next) => {
	try {
		const sauce = await sauceService.getOneSauce(req.params.id); // Find sauce by id

		if (!sauce) {
			throw new Error('Sauce not found');
		} else if (req.auth.userId !== sauce.userId) {
			throw new Error('Wrong user for this sauce');
		}

		await sauceService.deleteSauce(req.params.id); // Call the logic and validation function

		res.status(200).json({ message: 'Sauce deleted' }); // OK
	} catch (error) {
		logger.error(error);
		next(error);
	}
};

const likeSauceController = async (req, res, next) => {
	try {
		const { like, userId } = req.body;

		await sauceService.getOneSauce(req.params.id); // Find sauce by id

		await sauceService.likeSauce(req.params.id, like, userId); // Call the logic and validation function

		res.status(200).json({ message: 'Like/dislike updated!' }); // OK
	} catch (error) {
		logger.error(error);
		next(error);
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
