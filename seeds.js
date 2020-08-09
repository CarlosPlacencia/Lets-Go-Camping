var Campground  = require("./models/campground"),
    mongoose    = require("mongoose");
    Comment     = require("./models/comment")
    
    var data = [
        {
            name: "Allad",
            image: "https://thumbor.forbes.com/thumbor/960x0/https%3A%2F%2Fblogs-images.forbes.com%2Fannabel%2Ffiles%2F2018%2F02%2FLouisville_Skyline-1200x801.jpg",
            description: "blah blah"
        },
        {
            name: "KynMc",
            image: "https://static.toiimg.com/photo/60387019/.jpg",
            description: "blah blah blah"
        },
        {
            name: "Branfarm",
            image: "https://www.phila.gov/media/20181101152741/City-Hall-011-700x400.jpg",
            description: "blah blah blah blah"
        }
    ];

    async function seedDB(){
        try {
            await Campground.deleteMany({}); //DeprecationWarning: collection.remove is deprecated. Use deleteOne, deleteMany, or bulkWrite instead.
            console.log("Removed Campgrounds");
            for (const seed of data) {
                // add new Campgrounds            
                let campground = await Campground.create(seed);
                console.log("Campground created");
                // add new Comments
                let comment = await Comment.create({
                    text: "This place is really awesome",
                    author: "Deku"
                });
                campground.comments.push(comment);
                campground.save();
            }
        } catch (error) {
            console.log(error);
        }        
    }
module.exports = seedDB;