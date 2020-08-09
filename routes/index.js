var express = require("express")
var router = express.Router();

var   passport    = require("passport");
var   User        = require("../models/user");

// Root Page
router.get("/", function(req, res){
    res.render("landing");
});


//================================================================================
//  User Authentication Routes
//================================================================================

// REGISTER
router.get("/register", function(req, res){
    res.render("users/register", {page: 'register'});
});

router.post("/register", function(req, res){
    var newUser = new User ({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        username: req.body.username,
        avatar: req.body.avatar,  
    });

    if(newUser.avatar === ""){
        newUser.avatar = "https://cdn0.iconfinder.com/data/icons/user-pictures/100/unknown2-512.png";
    }

    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welocme to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});
 
// LOGIN
router.get("/login", function(req, res){
    res.render("users/login", {page: 'login'});
});

// router.post("/login", passport.authenticate("local",{
//     successRedirect: "/campgrounds",
//     failureRedirect: "/login",
// }));

router.post("/login", function(req, res, next){
    passport.authenticate('local', function(err, user, info) {
        if (err) {
          return next(err); // will generate a 500 error
        }
        // Generate a JSON response reflecting authentication status
        if (! user) {
            req.flash("error", "Invalid Username or Password");
            return res.redirect("/login");
        }
        
        req.login(user, loginErr => {
          if (loginErr) {
            return next(loginErr);
          }
          req.flash("success", "Welcome back " + user.username);
          return res.redirect("/campgrounds");
        });      
      })(req, res, next);
    });

// LOGOUT
router.get("/logout", function(req, res){
    req.logOut();
    req.flash("success", "Logged You Out!");
    res.redirect("/campgrounds");
})

module.exports = router;