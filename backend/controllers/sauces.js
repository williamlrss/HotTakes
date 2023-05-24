'use strict'

const Sauce = require('../models/sauces');
require('express-async-errors');
const fsPromises = require('fs').promises;

const getAllSauces = async (req, res) => {
    try {
        const sauces = await Sauce.find();
        res.status(200).json(sauces);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getOneSauce = async (req, res) => {
    try {
        const sauce = await Sauce.findById(req.params.id);
        if (!sauce) {
            res.status(404).json({ error: 'Sauce not found' });
        } else {
            res.status(200).json(sauce);
        }
    } catch (error) {
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
        res.status(400).json({ error: 'Bad request' });
    }
};

const updateSauce = async (req, res) => {
    try {
        const sauce = await Sauce.findById(req.params.id);
        if (!sauce) {
            res.status(404).json({ error: 'Sauce not found' });
        } else if (req.auth.userId !== sauce.userId) {
            res.status(403).json({ message: 'Non autorisé !' });
        } else {
            if (req.file) {
                await fsPromises.unlink(`images/${sauce.imageUrl}`);
                sauce.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
            }
            Object.assign(sauce, req.body);
            await sauce.save();
            res.status(200).json({ message: 'Sauce modifiée !' });
        }
    } catch (error) {
        res.status(400).json({ error: 'Bad request' });
    }
};

const deleteSauce = async (req, res) => {
    try {
        const sauce = await Sauce.findById(req.params.id);
        if (!sauce) {
            res.status(404).json({ error: 'Sauce not found' });
        } else if (req.auth.userId !== sauce.userId) {
            res.status(403).json({ message: 'Non autorisé !' });
        } else {
            await fsPromises.unlink(`images/${sauce.imageUrl}`);
            await sauce.remove();
            res.status(200).json({ message: 'Sauce supprimée !' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const likeSauce = async (req, res) => {
    try {
        const sauce = await Sauce.findById(req.params.id);
        if (!sauce) {
            res.status(404).json({ error: 'Sauce not found' });
        } else {
            const { like, userId } = req.body;
            const usersLiked = sauce.usersLiked;
            const usersDisliked = sauce.usersDisliked;
            if (like === 1) {
                if (usersLiked.includes(userId)) {
                    res.status(401).json({ error: 'Sauce déjà likée' });
                } else {
                    sauce.likes++;
                    usersLiked.push(userId);
                }
            } else if (like === -1) {
                if (usersDisliked.includes(userId)) {
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
        res.status(400).json({ error: 'Bad request' });
    }
};

module.exports = {
    getAllSauces,
    getOneSauce,
    createSauce,
    updateSauce,
    deleteSauce,
    likeSauce
  };