const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true, //just adds an index
    }
});

UserSchema.plugin(passportLocalMongoose);
// it adds username and hashed password to your schema

module.exports = mongoose.model('User', UserSchema);