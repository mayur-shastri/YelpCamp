const express = require('express');
const router = express.Router();
const catchAsync = require('../Utilities/catchAsync');
const campgrounds = require('../controllers/campgrounds');
const {isLoggedIn, isAuthor,validateCampground} = require('../middleware');
const multer = require('multer');
const {storage} = require('../cloudinary/index');
const upload = multer({storage});

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,upload.array('image'),validateCampground,catchAsync(campgrounds.create));

router.route('/new')
    .get(isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .patch(isLoggedIn, isAuthor, upload.array('image'), validateCampground,catchAsync(campgrounds.updateCampground))
    .delete(isAuthor, catchAsync(campgrounds.deleteCampground));

router.route('/:id/edit')
    .get(isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;