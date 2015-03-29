var express = require('express')
  , passport = require('passport')
  , morgan = require('morgan')
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser')
  , methodOverride = require('method-override')
  , session = require('express-session')
  , util = require('util')
  , MyUSAStrategy = require('passport-myusa').Strategy
  , Firebase = require('firebase');

// New Firebase instance

var MYUSA_CLIENT_ID = process.env.MYUSA_CLIENT_ID || "c2c669cfa2db3c91a8291f5e4f3dd539e12f5a28c708572f61681536237ffa86"
var MYUSA_CLIENT_SECRET = process.env.MYUSA_CLIENT_SECRET || "6ddf53f113a45ac98ab2945ca80eba3b18b6f0ef8f49ba5915e8a6b0e08a87b3";

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete MyUSA profile is
//   serialized and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


// Use the MyUSAStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and MyUSA
//   profile), and invoke a callback with a user object.
passport.use(new MyUSAStrategy({
    clientID: MYUSA_CLIENT_ID,
    clientSecret: MYUSA_CLIENT_SECRET,
    callbackURL: 'http://jimmyh.su:4242/auth/myusa/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // To keep the example simple, the user's MyUSA profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the MyUSA account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));



var app = express();

// configure Express
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(morgan('combined'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(methodOverride());
app.use(session({
  secret: 'g-man cat',
  resave: false,
  saveUninitialized: true
}));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));


app.get('/', function(req, res){
  console.log(req.user);
  // checking to make sure users exists
  if(req.user) {
    var jsonData = req.user._json;
    var fbNewUser = new Firebase('https://blistering-inferno-7388.firebaseio.com/voters/' + req.user.id);
    fbNewUser.set({
      email      : jsonData.email,
      first_name : jsonData.first_name,
      last_name  : jsonData.last_name,
      address    : jsonData.address,
      address2   : jsonData.address2,
      city       : jsonData.city,
      state      : jsonData.state,
      profile    : jsonData.zip
    });
    res.redirect('https://blistering-inferno-7388.firebaseapp.com/#/dashboard');
  } else {
    // old stuff
    // res.render('index', { user: req.user });

    // send back some data
    res.status(400).send('No data!');
  }
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});

// GET /auth/myusa
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in MyUSA authentication will involve
//   redirecting the user to my.usa.gov.  After authorization, MyUSA
//   will redirect the user back to this application at /auth/myusa/callback
//   or whatever you specified when you registered your myusa application
app.get('/auth/myusa',
  passport.authenticate('myusa', {scope:
  [
    'profile.email',
    'profile.first_name',
    'profile.last_name',
    'profile.address',
    'profile.address2',
    'profile.city',
    'profile.state',
    'profile.zip'
  ]
  }),
  function(req, res){
    // The request will be redirected to MyUSA for authentication, so this
    // function will not be called.
  }
);

// GET /auth/myusa/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/myusa/callback',
  passport.authenticate('myusa', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.listen(4242);


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}