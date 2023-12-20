const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./Utilities/ExpressError');

const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

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

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:camp_id/reviews', reviewRoutes);

app.get('/',(req,res)=>{
    res.render('home');
});

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