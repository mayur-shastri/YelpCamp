const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const CampgroundSchema = Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    images: [
        {
            url: String,
            filename: String,
        }
    ],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
    }]
});

CampgroundSchema.post('findOneAndDelete', async (campground)=>{
    if(campground){
    const reviews = campground.reviews;
    await Review.deleteMany({_id: {$in: reviews}});
    }
});

module.exports = mongoose.model('Campground',CampgroundSchema);