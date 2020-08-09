// Import Packages
require('dotenv').config();
var express         = require("express");
var app             = express();
var bodyParser      = require("body-parser");
var mongoose        = require("mongoose");
var methodOverride  = require("method-override");
var flash           = require("connect-flash");

// Models
var Campground      = require("./models/campground");
var Comment         = require("./models/comment");
var seedDB          = require("./seeds");

// Routes
var campgroundRoutes    =   require("./routes/campgrounds"),
    commentRoutes       =   require("./routes/comments"),
    indexRoutes         =   require("./routes/index"),
    userRoutes          =   require("./routes/users");


// User Authentication Packages
var   passportLocalMongoose     = require("passport-local-mongoose");
var   LocalStrategy             = require("passport-local");
var   passport                  = require("passport");
var   User                      = require("./models/user");

// Connect to the database
mongoose.connect("mongodb://localhost/yelp_camp_v13", {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log("Database Connection Established"))
.catch(err => console.log("Database Connection Failure", err));


// Telling Express to use body parser
app.use(bodyParser.urlencoded({extended: true}));
// Don't have to include the .ejs extension
app.set("view engine", "ejs");
// Connect to the CSS sheet
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// Seeding the database
//seedDB();

// Moment Js
app.locals.moment = require("moment");

// Passport Setup (Authentication)
app.use(require("express-session")({
    secret: "My second Authentication",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

// Will pass currentUser to all the routes(Pages)
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


// Using the Routes
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/profile", userRoutes);
app.use("/", indexRoutes);

// Add the port
app.listen(3000, function(){
    console.log("Server has started");
});