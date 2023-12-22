const express = require('express');
const router = express.Router();
const catchAsync = require('../Utilities/catchAsync');
const campgrounds = require('../controllers/campgrounds');
const {isLoggedIn, isAuthor,validateCampground} = require('../middleware');

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.create));

router.route('/new')
    .get(isLoggedIn , campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .patch(isLoggedIn, validateCampground, isAuthor, catchAsync(campgrounds.updateCampground))
    .delete(isAuthor, catchAsync(campgrounds.deleteCampground));

router.route('/:id/edit')
    .get(isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;