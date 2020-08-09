var express = require("express")
var router = express.Router();

//Models
var Campground = require("../models/campground");
var User       = require("../models/user");

// Middleware
var middleware = require("../middleware");

router.get("/:id", function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            req.flash("error", "User not found");
            return res.redirect("back");
        }
        Campground.find().where("author.id").equals(foundUser._id).exec(function(err, campgrounds){
            if(err){
                req.flash("error", "Something went wron when trying to find the users campgrounds");
                return res.redirect("back");
            }
            res.render("users/index", {user: foundUser, campgrounds: campgrounds});
        });
    });
})

module.exports = router;