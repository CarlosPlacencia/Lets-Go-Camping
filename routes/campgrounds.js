var express = require("express")
var router = express.Router();

//Models
var Campground = require("../models/campground");
var Comment    = require("../models/comment"); 

// Middleware
var middleware = require("../middleware");

// Requiring NodeGeocoder
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

//===============================================================================
//  Campground Routes
//================================================================================

// Campground Page | INDEX
router.get("/", function(req, res){
    Campground.find({}, function(err, allCampgrounds){ 
        if(err){console.log(err)}
        else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds, page: 'campgrounds'});
        }
    })
    
});

// Add to the database | CREATE
router.post("/", middleware.IsLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var description = req.body.description;
    var author = {
        id: req.user.id,
        username: req.user.username
    };
    
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
            console.log(err.message);
            req.flash('error', 'Invalid address');
            return res.redirect('back');
        }
        var lat = data[0].latitude;
        var lng = data[0].longitude;
        var location = data[0].formattedAddress;
        var newCampgrounds = {name: name, image: image, price: price, description: description, author: author, location: location, lat: lat, lng: lng};
        Campground.create(newCampgrounds, function(err, newlyCreated){
            if(err){console.log("Unable To Create New Campground")}
            else{res.redirect("/campgrounds");}
        });
    });   
});

// Campgrounds form | NEW
router.get("/new", middleware.IsLoggedIn, function(req, res){
    res.render("campgrounds/new");
})

// Unique Data | SHOW
router.get("/:id", function(req, res){
    //Get Id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err|| !foundCampground ){
            req.flash("error", "Campground not found");
            res.redirect("back");
        }
        else{ res.render("campgrounds/show", {campground: foundCampground, apiKey: process.env.GEOCODER_API_KEY});}
    });
});

// Campground Edit  | GET
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err) {res.redirect("/campgrounds");}
            else{res.render("campgrounds/edit", {campground: foundCampground});}
        });
});

// Campground Update | PUT
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
          req.flash('error', 'Invalid address');
          return res.redirect('back');
        }
        req.body.campground.lat = data[0].latitude;
        req.body.campground.lng = data[0].longitude;
        req.body.campground.location = data[0].formattedAddress;
        Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCamp){
            if(err) {res.redirect("/campgrounds");}
            else {res.redirect("/campgrounds/" + req.params.id);}
        });
    });
});

// Campground DESTROY | DELETE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res, next){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            return next(err);
            //res.redirect("/camgrounds");
        }
        else{
            campground.remove();
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;