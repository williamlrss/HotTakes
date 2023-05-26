'use strict';

const Sauce = require('../models/sauces');
const logger = require('../winston');
const fsPromises = require('fs').promises;
require('express-async-errors')

const getAllSauces = async (req, res) => {
    try {
        const sauces = await Sauce.find();
        res.status(200).json(sauces);
    } catch (error) {
        logger.error('Error in getAllSauces:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getOneSauce = async (req, res) => {
    try {
        const sauce = await Sauce.findById(req.params.id);
        if (!sauce) {
            logger.error('Sauce not found');
            res.status(404).json({ error: 'Sauce not found' });
        } else {
            res.status(200).json(sauce);
        }
    } catch (error) {
        logger.error('Error in getOneSauce:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createSauce = async (req, res) => {
    try {
        const sauceObject = JSON.parse(req.body.sauce);
        const sauce = new Sauce({
            ...sauceObject,
            likes: 0,
            dislikes: 0,
            usersLiked: [],
            usersDisliked: [],
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        });
        await sauce.save();
        res.status(201).json({ message: 'Sauce enregistrée !' });
    } catch (error) {
        logger.error('Error in createSauce:', error);
        res.status(400).json({ error: 'Bad request' });
    }
};

const updateSauce = async (req, res) => {
    try {
        const sauce = await Sauce.findById(req.params.id);
        if (!sauce) {
            return res.status(404).json({ error: 'Sauce not found' });
        }
        if (req.auth.userId !== sauce.userId) {
            return res.status(403).json({ message: 'Non autorisé !' });
        }
        if (req.file) {
            const filename = sauce.imageUrl.split('/').pop();
            await fsPromises.unlink(`images/${filename}`);
            sauce.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
        }
        Object.assign(sauce, req.body);
        await sauce.save();
        res.status(200).json({ message: 'Sauce modifiée !' });
    } catch (error) {
        logger.error('Error in updateSauce:', error);
        res.status(500).json({ error: 'Failed to update sauce' });
    }
};


const deleteSauce = async (req, res) => {
    try {
        const sauce = await Sauce.findById(req.params.id);
        if (!sauce) {
            return res.status(404).json({ error: 'Sauce not found' });
        }
        if (req.auth.userId !== sauce.userId) {
            return res.status(403).json({ message: 'Non autorisé !' });
        }

        // Get the file name from the imageUrl property
        const fileName = sauce.imageUrl.split('/').pop();

        // Delete the image file
        fsPromises.unlink(`images/${fileName}`, (error) => {
            if (error) {
                console.error('Error deleting image:', error);
            }
        });

        await sauce.deleteOne(); // Use the deleteOne method instead of remove
        res.status(200).json({ message: 'Sauce supprimée !' });
    } catch (error) {
        console.error('Error in deleteSauce:', error);
        res.status(500).json({ error: 'Failed to delete sauce' });
    }
};


const likeSauce = async (req, res) => {
    try {
        const sauce = await Sauce.findById(req.params.id);
        if (!sauce) {
            logger.error('Sauce not found');
            res.status(404).json({ error: 'Sauce not found' });
        } else {
            const { like, userId } = req.body;
            const usersLiked = sauce.usersLiked;
            const usersDisliked = sauce.usersDisliked;
            if (like === 1) {
                if (usersLiked.includes(userId)) {
                    logger.error('Sauce already liked');
                    res.status(401).json({ error: 'Sauce déjà likée' });
                } else {
                    sauce.likes++;
                    usersLiked.push(userId);
                }
            } else if (like === -1) {
                if (usersDisliked.includes(userId)) {
                    logger.error('Sauce already disliked');
                    res.status(401).json({ error: 'Sauce déjà dislikée' });
                } else {
                    sauce.dislikes++;
                    usersDisliked.push(userId);
                }
            } else if (like === 0) {
                if (usersLiked.includes(userId)) {
                    sauce.likes--;
                    usersLiked.splice(usersLiked.indexOf(userId), 1);
                } else if (usersDisliked.includes(userId)) {
                    sauce.dislikes--;
                    usersDisliked.splice(usersDisliked.indexOf(userId), 1);
                }
            }
            await sauce.save();
            res.status(200).json({ message: 'Like/dislike mis à jour !' });
        }
    } catch (error) {
        logger.error('Error in likeSauce:', error);
        res.status(400).json({ error: 'Bad request' });
    }
};

module.exports = {
    getAllSauces,
    getOneSauce,
    createSauce,
    updateSauce,
    deleteSauce,
    likeSauce,
};