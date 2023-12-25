const Campground = require('../models/campgrounds');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({accessToken: mapBoxToken});
const cloudinary = require('cloudinary').v2;
// const folderPath = 'YelpCamp';  // path of the images folder in cloudinary

module.exports.index = async (req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
}

module.exports.renderNewForm =  (req,res)=>{
    res.render('campgrounds/new');
}

module.exports.create = async (req,res,next)=>{
    // const geoData = await geoCoder.forwardGeocode({
    //     query: req.body.campground.location,
    //     limit: 1,
    // }).send();
    // const features = await geoData.body.features;
    // const geometry = features[0].geometry;
    const campground = new Campground(req.body.campground);
    // campground.geometry = geometry;
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
    let imagesToDelete = req.body.imagesToDelete;
    if(imagesToDelete){
        if (!Array.isArray(imagesToDelete)) {
            imagesToDelete = [Number(imagesToDelete)];
        } else {
            imagesToDelete = imagesToDelete.map(Number);
        }
        for (const index of imagesToDelete.sort((a, b) => b - a)) {
            let image = camp.images[index];
            await cloudinary.uploader.destroy(`${image.filename}`);
            camp.images.splice(index, 1);
        }
        console.log(camp.images);
    }
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
    const camp = await Campground.findByIdAndDelete(id);
    for(let image of camp.images){
        await cloudinary.uploader.destroy(`${image.filename}`);
    }
    req.flash('success', "Campground Deleted Successfully!");
    res.redirect('/campgrounds');
}
