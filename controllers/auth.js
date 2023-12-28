const User = require('../models/user');


module.exports.renderRegister = (req,res)=>{
    res.render('auth/register');
}

module.exports.registerUser = async (req,res)=>{
    try{
    const {email,username,password} = req.body;
    const user = new User({email, username});
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to YelpCamp!");
        res.redirect('/campgrounds');
    });
    } catch(e){
        req.flash("error", e.message);
        res.redirect('/register');
    }
}

module.exports.renderLogin = (req,res)=>{
    res.render('auth/login');
}

module.exports.login = async (req,res)=>{
    req.flash('success', 'Welcome Back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    delete res.locals.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logOut = (req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash('success', 'Logged Out Successfully!');
        const redirectUrl = req.headers.referer || '/campgrounds';
        res.redirect(redirectUrl);
    });
}