const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./Utilities/ExpressError');
const User = require('./models/user');

const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const authRoutes = require('./routes/auth');

const passport = require('passport');
const localStrategy = require('passport-local'); 

const session = require('express-session');
const flash = require('connect-flash');
const sessionConfig = {
    secret: "thisisabadsecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7,
    }
};

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

app.use(session(sessionConfig));
app.use(flash());

app.use(express.urlencoded({extended: true}));
// parses the url encoded data such as request body into a javascript object
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.returnTo = '';
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:camp_id/reviews', reviewRoutes);
app.use('/', authRoutes);

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