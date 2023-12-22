const express = require('express');
const router = express.Router();
const catchAsync = require('../Utilities/catchAsync');
const passport = require('passport');
const {storeReturnTo} = require('../middleware');
const authController = require('../controllers/auth');
 
router.route('/register')
    .get(authController.renderRegister)
    .post(catchAsync(authController.registerUser));

router.route('/login')
    .get(authController.renderLogin)
    .post(storeReturnTo,passport.authenticate('local',
    {failureFlash: true, failureRedirect: '/login'}), catchAsync(authController.login));

router.route('/logout')
    .get(authController.logOut);

module.exports = router;