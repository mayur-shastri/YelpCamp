const express = require('express');
const router = express.Router({mergeParams: true});

const catchAsync = require('../Utilities/catchAsync');
const ExpressError = require('../Utilities/ExpressError');

const {reviewSchema} = require('../Schemas/schemas');
const Campground = require('../models/campgrounds');
const Review = require('../models/review');

const validateReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(element => element.message).join(',');
        throw new ExpressError(400,msg);
    } else{
        next();
    }
}

router.post('/', validateReview, catchAsync(async (req,res,next)=>{
    const {camp_id} = req.params;
    const campground = await Campground.findById(camp_id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', "Review Submitted Successfully!");
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:review_id', catchAsync(async (req,res,next)=>{
    const {camp_id,review_id} = req.params;
    await Campground.findByIdAndUpdate(camp_id,{$pull: {reviews: review_id}});
    await Review.findByIdAndDelete(review_id);
    req.flash('success', "Review Deleted Successfully!");
    res.redirect(`/campgrounds/${camp_id}`);
}));

module.exports = router;