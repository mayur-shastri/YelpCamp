const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campgrounds');
const campgrounds = require('./models/campgrounds');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./Utilities/ExpressError');
const catchAsync = require('./Utilities/catchAsync');
const {campgroundSchema} = require('./Schemas/schemas');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", ()=>{
    console.log("Database connected");
});

const app = express();

app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'));
app.engine('ejs',ejsMate);

app.use(express.urlencoded({extended: true}));
// parses the url encoded data such as request body into a javascript object
app.use(express.json());
app.use(methodOverride('_method'));

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

app.get('/',(req,res)=>{
    res.render('home');
});

app.get('/campgrounds', catchAsync(async (req,res)=>{
    console.log("All campgrounds");
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
}));

app.get('/campgrounds/new', (req,res)=>{
    res.render('campgrounds/new');
});

app.post('/campgrounds', validateCampground, catchAsync(async (req,res,next)=>{
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

app.get('/campgrounds/:id', catchAsync(async (req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        throw new ExpressError(404, "Campground not found!");
    }
    res.render('campgrounds/show', {campground});
}));

app.get('/campgrounds/:id/edit', catchAsync(async (req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', {campground});
}));

app.patch('/campgrounds/:id', validateCampground, catchAsync(async (req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    res.redirect(`/campgrounds/${campground._id}`);
}));

app.delete('/campgrounds/:id', catchAsync(async (req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

app.all('*', (err,req,res,next)=>{
    next(new ExpressError(404, "Page not found!"));
});

app.use((err,req,res,next)=>{
    const {status = 500} = err;
    if(!err.message){
        err.message = "Oh No!! Something went wrong.";
    }
    res.status(status).render('error', {err, status});
});

app.listen(3000,()=>{
    console.log("Listening to port 3000...");
});