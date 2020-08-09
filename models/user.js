var passportLocalMongoose       = require("passport-local-mongoose"),
    mongoose                    = require("mongoose");

// Create Schema
var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    avatar: String, // Could add a default avatar string
    firstName: String,
    lastName: String,
    email: String,
}); 

UserSchema.plugin(passportLocalMongoose);

// Return the Schema with module.export
module.exports = mongoose.model("User", UserSchema);