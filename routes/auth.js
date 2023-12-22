const express = require('express');
const User = require('../models/user');
const router = express.Router();
const catchAsync = require('../Utilities/catchAsync');
const passport = require('passport');
const {storeReturnTo} = require('../middleware');
const authController = require('../controllers/auth');


router.get('/register', authController.renderRegister);

router.post('/register', catchAsync(authController.registerUser));

router.get('/login', authController.renderLogin);

router.post('/login' ,storeReturnTo,passport.authenticate('local',
{failureFlash: true, failureRedirect: '/login'}), catchAsync(authController.login));

router.get('/logout', authController.logOut);

module.exports = router;