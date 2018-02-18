const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const _ = require('lodash');

const mysql = require('../mysql.js');

passport.serializeUser((user, done) => {
  console.log(`serializeUser: ${user.username}`);
  return done(null, _.get(user, 'username', false));
});

passport.deserializeUser((username, done) => {
  mysql.user(username).then((user) => {
    if (_.isEmpty(user)) {
      return done(null, false);
    }
    return done(null, user[0]);
  })
  .catch((err) => {
    return done(err, false);
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
