const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../Utilities/catchAsync');
const {isLoggedIn,validateReview,isReviewAuthor} = require('../middleware');
const reviews = require('../controllers/reviews');


router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete('/:review_id', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;