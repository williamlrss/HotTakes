'use strict';

const express = require('express');
const router = express.Router();

const saucesController = require('../controllers/sauces');
const multer = require('../middleware/multer');
const authenticate = require('../middleware/authenticate');

router.get('/', authenticate, saucesController.getAllSauces);
router.get('/:id', authenticate, saucesController.getOneSauce);
router.post('/', authenticate, multer, saucesController.createSauce);
router.put('/:id', authenticate, multer, saucesController.updateSauce);
router.delete('/:id', authenticate, saucesController.deleteSauce);
router.post('/:id/like', authenticate, saucesController.likeSauce);

module.exports = router;