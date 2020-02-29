const express = require('express');
const cookieSession = require('cookie-session');
const passport = require('passport');
const socket = require('socket.io');
const authRoutes = require('./routes/auth-routes');
const pageRoutes = require('./routes/page-routes');
const profileRoutes = require('./routes/profile-routes');
const passportSetup = require('./config/passport-setup');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const risk = require('./risk');

const app = express();

// set view engine
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// set up session cookies
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// initialize bodyParser

// connect to mongodb
mongoose.connect(keys.mongodb.dbURI, () => {
    console.log('connected to mongodb');
});

// set up authorization and profile routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/', pageRoutes);

// begin listening for requests
var server = app.listen(3000, () => {
    console.log('app now listening for requests on port 3000');
});

risk(server);
