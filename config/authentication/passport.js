const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const mysql = require('../mysql.js');

passport.serializeUser((user, done) => {
  console.log('serializeUser');
  console.log(user.username);
  return done(null, user.username);
});

passport.deserializeUser((username, done) => {
  mysql.user(username).then((user) => {
    return done(null, user[0]);
  });
});

passport.use(new LocalStrategy((username, password, done) => {
  // Get username and password from table 'users'
  mysql.user(username).then((user) => {
    // console.log('User from db or error: ' + util.inspect(user, false, null));
    // If user doesn't exist
    if (!user[0]) {
      return done(null, false);
    }
    // If wrong password
    if (!bcrypt.compareSync(password, user[0].password)) {
      console.log(`Wrong password for: ${username}`);
      return done(null, false);
    }
    // If username and password is correct
    console.log(`Logged in as: ${username}`);
    return done(null, user[0]);
  });
}));
