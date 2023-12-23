const Campground = require('../models/campgrounds');

module.exports.index = async (req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
}

module.exports.renderNewForm =  (req,res)=>{
    res.render('campgrounds/new');
}

module.exports.create = async (req,res,next)=>{
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f => ({
        url: f.path,
        filename: f.filename,
    }));
    campground.author = req.user._id;
    await campground.save();
    req.flash('success','Campground Successfully Created!');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.updateCampground = async (req,res,next)=>{
    const {id} = req.params;
    const camp = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    camp.images.push(...req.files.map(img=>({
        url: img.path,
        filename: img.filename,
    })));
    await camp.save();
    req.flash('success','Campground Updated Successfully!');
    res.redirect(`/campgrounds/${camp._id}`);
}

module.exports.showCampground = async (req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author', //review author, not campground author
        }}).populate('author');
    if(!campground){
        req.flash('error', "Campground Not Found!");
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground});
}

module.exports.renderEditForm = async (req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error', "Campground Not Found!");
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground});
}

module.exports.deleteCampground = async (req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', "Campground Deleted Successfully!");
    res.redirect('/campgrounds');
}
