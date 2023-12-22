const Campground = require('./models/campgrounds');
const Review = require('./models/review');
const ExpressError = require('./Utilities/ExpressError');
const {campgroundSchema, reviewSchema} = require('./Schemas/schemas');

const isLoggedIn = (req,res,next)=>{
    req.session.returnTo = req.originalUrl;
    if(!req.isAuthenticated()){
        req.flash('error', 'You must be signed in to create a campground!');
        return res.redirect('/login');
    }
    next();
}

const storeReturnTo = (req,res,next)=>{
    if(req.session.returnTo){
        res.locals.returnTo = req.session.returnTo;
    }   
    next();
}

const isAuthor = async (req,res,next)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error','You don\'t have the permission to do that!');
        return res.redirect(`/campgrounds/${campground._id}`);
    }
    next();
}

const isReviewAuthor = async (req,res,next)=>{
    const {review_id} = req.params;
    const review = await Review.findById(review_id);
    if(!review.author.equals(req.user._id)){
        req.flash('error','You don\'t have the permission to do that!');
        return res.redirect(`/campgrounds/${review._id}`);
    }
    next();
}

const validateCampground = (req,res,next)=>{
    //server side validation
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(element => element.message).join(',');
        throw new ExpressError(400,msg);
    } else{
        next();
    }
}

const validateReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(element => element.message).join(',');
        throw new ExpressError(400,msg);
    } else{
        next();
    }
}

module.exports = {
                isLoggedIn,
                storeReturnTo,
                isAuthor,
                validateCampground,
                validateReview,
                isReviewAuthor,
                };