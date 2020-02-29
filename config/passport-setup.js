const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const keys = require('./keys');
const User = require('../models/user-model');

passport.serializeUser((user,done)=>{
  done(null,user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
      done(null,user);
    });
});

passport.use(
    new GoogleStrategy({
        // options for google strategy
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: '/auth/google/redirect'
    }, (accessToken,refreshToken,profile,done) => {
      // for for user
      User.findOne({userId: profile.id}).then((currentUser)=>{
        if(currentUser){
          console.log('user is '+currentUser);
          done(null,currentUser);
        } else {
          new User({
            userId: profile.id,
            username: profile.displayName,
            thumbnail: profile._json.image.url
          }).save().then((newUser)=>{
            done(null,newUser);
          })
        }
      })
    })
);

passport.use(
  new GitHubStrategy({
    clientID: keys.github.clientID,
    clientSecret: keys.github.clientSecret,
    callbackURL: "/auth/github/redirect"
  }, (accessToken, refreshToken, profile, done) => {
    // for for user
    User.findOne({userId: profile.id}).then((currentUser)=>{
      if(currentUser){
        console.log('user is '+currentUser);
        done(null,currentUser);
      } else {
        console.log(profile);
        new User({
          userId: profile.id,
          username: profile.username,
          thumbnail: profile.photos[0].value
        }).save().then((newUser)=>{
          done(null,newUser);
        })
      }
    })
  })
);
