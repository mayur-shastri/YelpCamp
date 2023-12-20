const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    body: String,
    rating: {
        type: Number,
        required: true,
    }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;