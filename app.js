//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
// Step 1 for install cookie and passport indall below 3 npm package
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
// Step 2 start here
app.use(session({
  secret: 'This is our little secret',
  resave: false,
  saveUninitialized: true,
  // cookie: { secure: true }
}))

app.use(passport.initialize());
app.use(passport.session());
// Step 2 close

mongoose.connect('mongodb://localhost:27017/userDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set('useCreateIndex', true); //step 5//
const userSchema = new mongoose.Schema({
  email: String,
  password: String
})

userSchema.plugin(passportLocalMongoose); //Step 3//

const User = mongoose.model('User', userSchema)
// Step 4 started
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// Step 4 close.


//TODO and Write your Code
app.get('/', function(req, res) {
  res.render('home')
})

app.get('/login', function(req, res) {
  res.render('login')
})

app.get('/register', function(req, res) {
  res.render('register')
})

// Step 9 logout system code start here
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});
// Logout code close


// step 7 started
app.get('/secrets', function(req, res) {
  if (req.isAuthenticated()) {
    res.render('secrets')
  } else {
    res.redirect('login')
  }
})
// step 7 colsed

// Step 6 for registration purpose started
app.post('/register', function(req, res) {
  User.register({
    username: req.body.username
  }, req.body.password, function(err, user) {
    if (err) {
      res.redirect('/register');
    } else {
      // passport come form passport npm package
      passport.authenticate("local")(req, res, function() {
        res.redirect('/secrets');
      })
    }
  })

})
// Step 6 close


// Step 8 login system started here
app.post('/login', function(req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  })
  req.login(user, function(err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function() {
        res.redirect('/secrets');
      })
    }
  })
})
// step 8 login systerm close.

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
