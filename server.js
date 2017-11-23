const express = require('express');
const graphqlHTTP = require('express-graphql');
const _ = require('lodash');
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
const loaders = require('./schema-es5/loaders');
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

const exists = (object, path) => {
  return !_.isEmpty(_.get(object, path));
};

function createLoaders() {
  return {
    UserLoader: loaders.UserLoader.getLoader(),
    MemoryLoader: loaders.MemoryLoader.getLoader(),
    TagLoader: loaders.TagLoader.getLoader(),
  };
}

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
    context: {
      user: request.user,
      loaders: createLoaders(),
    },
    pretty: true,
    graphiql: true,
  };
}));

app.get('/', (req, res) => {
  if (_.get(req.user, 'user_id')) {
    res.send(template({ title: 'Diary', script: 'HomePage.js' }));
  } else {
    res.send('Not logged in.');
  }
});

app.get('/login', (req, res) => {
  // res.send('test');
  res.send(template({ title: 'Login', script: 'LoginPage.js' }));
});
app.post('/login', passport.authenticate(
  'local',
  {
    successRedirect: '/',
    failureRedirect: '/login',
  }
));

app.get('/new', (req, res) => {
  res.send(template({ title: 'New memory', script: 'DraftingPage.js' }));
});

app.get('/:memory_id', (req, res) => {
  res.send(template({ title: 'Memory', script: 'MemoryPage.js' }));
});
app.get('/:memory_id/edit', (req, res) => {
  res.send(template({ title: 'MemoryEdit', script: 'MemoryEditPage.js' }));
});

app.listen(PORT, () => {
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`Listening on port: ${PORT}`);
});
