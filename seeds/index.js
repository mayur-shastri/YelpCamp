const mongoose = require('mongoose');
const Campground = require('../models/campgrounds');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", ()=>{
    console.log("Database connected");
});

const sample = (arr)=>{
    return arr[Math.floor(Math.random()*arr.length)];
}

const seedDB = async()=>{
    await Campground.deleteMany({});
    for(let i=0; i<50; i++){
       const random1000 = Math.floor(Math.random()*1000);
       const price = Math.floor(Math.random()*20)+10;
       const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aperiam nihil, asperiores provident voluptatem minima nobis inventore perferendis delectus cum. Hic vel sint corrupti minus magnam commodi vitae ut dolores numquam?',
            price: price,
            author: '658546eacfa3c8a1b39590d8',
       });
       await camp.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
});