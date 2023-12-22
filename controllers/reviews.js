const Review = require('../models/review');
const Campground = require('../models/campgrounds');

module.exports.createReview = async (req,res,next)=>{
    const {camp_id} = req.params;
    const campground = await Campground.findById(camp_id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', "Review Submitted Successfully!");
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReview = async (req,res,next)=>{
    const {camp_id,review_id} = req.params;
    await Campground.findByIdAndUpdate(camp_id,{$pull: {reviews: review_id}});
    await Review.findByIdAndDelete(review_id);
    req.flash('success', "Review Deleted Successfully!");
    res.redirect(`/campgrounds/${camp_id}`);
}