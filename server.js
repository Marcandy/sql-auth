const express = require('express');
const session = require('express-session')
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const config = require('./config.js')

const app = express();

app.use(session({
  secret: config.secret,
  resave: false,
  saveUnitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

passport.use('facebook', new FacebookStrategy({
  clientID: config.facebook.clientID,
  clientSecret: config.facebook.clientSecret,
  callbackURL: 'http://localhost:3000/auth/facebook/callback',
  profileFields: ['id', 'name']
}, (accessToken, refreshToken, profile, done) => {
  // access the database
  done(null, profile);
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
passport.authenticate('facebook'),
(req, res) => {
  // res.status(200).redirect('#'); // for demostration purpose we dont a home
  res.status(200).send(req.user);
});

app.listen(3000, () => {
  console.log('Listening 300');
})
