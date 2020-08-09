var mongoose = require("mongoose");
var Comment    = require("../models/comment"); 

// Schema Setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    location: String,
    lat: Number,
    lng: Number,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    createdAt: {type: Date, default: Date.now},
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        username: String
    }
});

// This is going to get called before the campground.remove()
campgroundSchema.pre("remove", async function(next){
    try {
        await Comment.deleteOne({
            "_id":{
                $in: this.comments
            }
        });
    } catch (error) {
        next(err);
    }
});

// Model
module.exports = mongoose.model("Campground", campgroundSchema);