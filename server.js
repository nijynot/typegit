const express = require('express');
const graphqlHTTP = require('express-graphql');
// const path = require('path');
// const fs = require('fs');
// const bcrypt = require('bcryptjs');

const passport = require('passport');
require('./config/authentication/passport.js');

const session = require('express-session');
// const RedisStore = require('connect-redis')(session);
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const schema = require('./schema-es5/schema.js');
const template = require('./views/template.js');

/* =================== */

// Constants
const PORT = 1337;
const staticOptions = {
  setHeaders: (res) => {
    if (process.env.NODE_ENV === 'production') {
      return res.setHeader('Content-Encoding', 'gzip');
    }
    return null;
  },
};

const sessionOptions = {
  name: 'local',
  // store: new RedisStore(redisOptions),
  saveUninitialized: true,
  resave: false,
  secret: 'FJ9y5po5aWYGlpFoEDwXeRYMU68TcQWTKNMqu8pU',
  cookie: {
    secure: false,
  },
};

/* =================== */

const app = express();

// Static
app.use('/assets', express.static('./public/js', staticOptions));
app.use('/assets/css', express.static('./public/css', staticOptions));
app.use('/assets/fonts', express.static('./public/fonts', staticOptions));

// Authentication, session, cookies. (Passport)
app.use(cookieParser('keyboard cat'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

/* =================== */

app.use('/graphql', graphqlHTTP((request) => {
  return {
    schema,
    rootValue: { request },
    context: { user: request.user },
    pretty: true,
    graphiql: true,
  };
}));

app.get('/', (req, res) => {
  res.send(template({ title: 'Diary', script: 'FrontPage.js' }));
});

app.get('/login', (req, res) => {
  res.send(template({ title: 'Login', script: 'LoginPage.js' }));
});
app.post('/login', passport.authenticate(
  'local',
  {
    successRedirect: '/',
    failureRedirect: '/login',
  }
));

app.listen(PORT, () => {
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`Listening on port: ${PORT}`);
});
