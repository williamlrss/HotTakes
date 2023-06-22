'use strict';

const authCtrl = require('../controllers/auth');
const express = require('express');
const router = express.Router();

router.post('/signup', authCtrl.signupUserController);
router.post('/login', authCtrl.loginUserController);
router.delete('/delete/:id', authCtrl.deleteUserController);
module.exports = router;
