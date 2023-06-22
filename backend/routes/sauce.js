'use strict';

const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauce');
const multer = require('../middleware/multer');
const authenticate = require('../middleware/authenticate');

router.get('/', authenticate, sauceCtrl.getAllSaucesController);
router.get('/:id', authenticate, sauceCtrl.getOneSauceController);
router.post('/', authenticate, multer, sauceCtrl.createSauceController);
router.put('/:id', authenticate, multer, sauceCtrl.updateSauceController);
router.delete('/:id', authenticate, sauceCtrl.deleteSauceController);
router.post('/:id/like', authenticate, sauceCtrl.likeSauceController);

module.exports = router;
