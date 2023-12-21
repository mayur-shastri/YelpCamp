const express = require('express');
const router = express.Router();
const catchAsync = require('../Utilities/catchAsync');
const Campground = require('../models/campgrounds');
const ExpressError = require('../Utilities/ExpressError');
const {campgroundSchema} = require('../Schemas/schemas');

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

router.get('/', catchAsync(async (req,res)=>{
    console.log("All campgrounds");
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
}));

router.get('/new', (req,res)=>{
    res.render('campgrounds/new');
});

router.post('/', validateCampground, catchAsync(async (req,res,next)=>{
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success','Campground Successfully Created!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.get('/:id', catchAsync(async (req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    if(!campground){
        req.flash('error', "Campground Not Found!");
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground});
}));

router.get('/:id/edit', catchAsync(async (req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error', "Campground Not Found!");
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground});
}));

router.patch('/:id', validateCampground, catchAsync(async (req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    req.flash('success','Campground Updated Successfully!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:id', catchAsync(async (req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', "Campground Deleted Successfully!");
    res.redirect('/campgrounds');
}));

module.exports = router;