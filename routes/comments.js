var express = require("express")
var router = express.Router({mergeParams: true});

//  Models
var Campground = require("../models/campground");
var Comment = require("../models/comment");

// Middleware
var middleware = require("../middleware");

//================================================================================
//  Comment Routes
//================================================================================

// Comment form | NEW
router.get("/new", middleware.IsLoggedIn, function(req, res){
    // Get the id of the campground and pass it to the form
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground not found");
            res.redirect("back");
        }
        else{res.render("comments/new", {campground: foundCampground});}
    });
});

// CREATE
router.post("/", middleware.IsLoggedIn, function(req, res){
    // get the campground id
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){console.log(err);}
        else{
                // create the comment
            Comment.create(req.body.comment, function(err, newComment){
                if(err){console.log(err);}
                else{
                    // Add username and ID to the comment
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    //Save Comment
                    newComment.save();
                    // assocciate the comment with the campground
                    //console.log(req.body.comment);
                    foundCampground.comments.push(newComment);
                    foundCampground.save();
                    //console.log(newComment);
                    req.flash("success", "Successfully added comment");
                    res.redirect("/campgrounds/" + foundCampground._id);
                }
            });
        }
    });
});

// EDIT 
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground not found");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){res.redirect("back")}
            else{
                res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
            }
        });
    });
});

// UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){res.redirect("back")}
        else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

// DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){res.redirect("back")}
        else{
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})


module.exports = router;