'use strict';

// Import required modules
const Sauce = require('../models/sauces'); // Import the Sauce model
const logger = require('../utils/winston'); // Import the logger module
const fsPromises = require('fs').promises; // Import the fsPromises module for file operations
require('express-async-errors'); // Import express-async-errors to handle asynchronous errors in Express

// Get all sauces
const getAllSauces = async (req, res) => {
    try {
        const sauces = await Sauce.find(); // Find all sauces in the database
        res.status(200).json(sauces); // Return the sauces as a JSON response
    } catch (error) {
        logger.error('Error in getAllSauces:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get a single sauce by ID
const getOneSauce = async (req, res) => {
    try {
        const sauce = await Sauce.findById(req.params.id); // Find the sauce by ID
        if (!sauce) {
            logger.error('Sauce not found'); // Log an error if the sauce is not found
            return res.status(404).json({ error: 'Sauce not found' });
        }
        res.status(200).json(sauce); // Return the sauce as a JSON response
    } catch (error) {
        logger.error('Error in getOneSauce:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Create a new sauce
const createSauce = async (req, res) => {
    try {
        const sauceObject = JSON.parse(req.body.sauce); // Parse the sauce object from the request body
        const sauce = new Sauce({
            ...sauceObject,
            likes: 0,
            dislikes: 0,
            usersLiked: [],
            usersDisliked: [],
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, // Generate the image URL based on the request protocol, host, and file name
        });
        await sauce.save(); // Save the new sauce to the database
        res.status(201).json({ message: 'Sauce registered !' }); // Return a success message
    } catch (error) {
        logger.error('Error in createSauce:', error);
        res.status(400).json({ error: 'Invalid sauce format' });
    }
};

// Update a sauce
const updateSauce = async (req, res) => {
    try {
        const sauce = await Sauce.findById(req.params.id); // Find the sauce by ID
        if (!sauce) {
            return res.status(404).json({ error: 'Sauce not found' }); // Return an error response if the sauce is not found
        }
        if (req.auth.userId !== sauce.userId) {
            return res.status(403).json({ message: 'Wrong user for this sauce' }); // Return an error response if the user is not authorized
        }
        if (req.file) {
            const filename = sauce.imageUrl.split('/').pop(); // Get the file name from the imageUrl property
            await fsPromises.unlink(`images/${filename}`); // Delete the existing image file
            sauce.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`; // Update the image URL based on the request protocol, host, and new file name
        }
        Object.assign(sauce, req.body); // Update the sauce object with the request body
        await sauce.save(); // Save the updated sauce to the database
        res.status(200).json({ message: 'Sauce updated' }); // Return a success message
    } catch (error) {
        logger.error('Error in updateSauce:', error);
        res.status(500).json({ error: 'Failed to update sauce' });
    }
};

// Delete a sauce
const deleteSauce = async (req, res) => {
    try {
        const sauce = await Sauce.findById(req.params.id); // Find the sauce by ID
        if (!sauce) {
            return res.status(404).json({ error: 'Sauce not found' }); // Return an error response if the sauce is not found
        }
        if (req.auth.userId !== sauce.userId) {
            return res.status(403).json({ message: 'Wrong user for this sauce' }); // Return an error response if the user is not authorized
        }

        const fileName = sauce.imageUrl.split('/').pop(); // Get the file name from the imageUrl property

        await fsPromises.unlink(`images/${fileName}`); // Delete the image file

        await sauce.deleteOne(); // Delete the sauce from the database
        res.status(200).json({ message: 'Sauce deleted' }); // Return a success message
    } catch (error) {
        logger.error('Error in deleteSauce:', error);
        res.status(500).json({ error: 'Failed to delete sauce' });
    }
};

// Like or dislike a sauce
const likeSauce = async (req, res) => {
    try {
        const sauce = await Sauce.findById(req.params.id); // Find the sauce by ID
        if (!sauce) {
            logger.error('Sauce not found'); // Log an error if the sauce is not found
            return res.status(404).json({ error: 'Sauce not found' });
        }
        const { like, userId } = req.body;
        const usersLiked = sauce.usersLiked;
        const usersDisliked = sauce.usersDisliked;

        if (like === 1) {
            if (usersLiked.includes(userId)) {
                logger.error('Sauce already liked'); // Log an error if the sauce is already liked by the user
                return res.status(401).json({ error: 'Sauce already liked' });
            }
            sauce.likes++;
            usersLiked.push(userId);
        } else if (like === -1) {
            if (usersDisliked.includes(userId)) {
                logger.error('Sauce already disliked'); // Log an error if the sauce is already disliked by the user
                return res.status(401).json({ error: 'Sauce déjà dislikée' });
            }
            sauce.dislikes++;
            usersDisliked.push(userId);
        } else if (like === 0) {
            if (usersLiked.includes(userId)) {
                sauce.likes--;
                usersLiked.splice(usersLiked.indexOf(userId), 1);
            } else if (usersDisliked.includes(userId)) {
                sauce.dislikes--;
                usersDisliked.splice(usersDisliked.indexOf(userId), 1);
            }
        }

        await sauce.save(); // Save the updated sauce to the database
        res.status(200).json({ message: 'Like/dislike mis à jour !' }); // Return a success message
    } catch (error) {
        logger.error('Error in likeSauce:', error);
        res.status(400).json({ error: 'Bad request' });
    }
};

// Export the functions as module exports
module.exports = {
    getAllSauces,
    getOneSauce,
    createSauce,
    updateSauce,
    deleteSauce,
    likeSauce,
};