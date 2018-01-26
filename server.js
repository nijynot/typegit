// Express and server stuff
const fs = require('fs');
const path = require('path');
const https = require('https');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const multer = require('multer');
const _ = require('lodash');
const uuidV4 = require('uuid/v4');
const redis = require('redis');
const mysql = require('./config/mysql.js');

// Redis Client
const client = redis.createClient();
client.select(4);

// Authentication
const passport = require('passport');
require('./config/authentication/passport.js');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// GraphQL
const schema = require('./schema-es5/schema.js');
const getLoaders = require('./schema-es5/loaders/getLoaders.js');
const template = require('./views/template.js');

/* ===== Constants and Helpers ===== */

let PORT;
let privateKey;
let publicKey;
let domain;

if (process.env.NODE_ENV === 'production') {
  PORT = 443;
  domain = 'https://lowerset.com';
  privateKey = fs.readFileSync('/etc/letsencrypt/live/lowerset.com/privkey.pem');
  publicKey = fs.readFileSync('/etc/letsencrypt/live/lowerset.com/fullchain.pem');
} else {
  PORT = 8080;
  domain = 'http://localhost:8080';
}

const staticOptions = {
  setHeaders: (res) => {
    if (process.env.NODE_ENV === 'production') {
      return res.setHeader('Content-Encoding', 'gzip');
    }
    return null;
  },
};

const redisOptions = {
  client,
  host: 'localhost',
  port: 6379,
};

const sessionOptions = {
  name: 'local',
  store: new RedisStore(redisOptions),
  saveUninitialized: true,
  resave: false,
  secret: 'FJ9y5po5aWYGlpFoEDwXeRYMU68TcQWTKNMqu8pU',
  cookie: {
    // maxAge: 2592000000,
    maxAge: 72576000,
    secure: false,
  },
};

// Multer
const diskStorage = multer.diskStorage({
  destination: `${__dirname}/public/tmp`,
  filename: (req, file, cb) => {
    const uuid = uuidV4();
    // app.locals.uuid = uuid;
    cb(null, `${uuid}`);
  },
});
const fileFields = [
  { name: 'files', maxCount: 10 },
  { name: 'file', maxCount: 1 },
];

/* ===== Middleware ===== */

const app = express();
let appHttp;
if (process.env.NODE_ENV === 'production') {
  appHttp = express();
}

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1); // trust first proxy
}

// Static
app.use('/.well-known/acme-challenge', express.static('./.well-known/acme-challenge'));
app.use('/assets', express.static('./public/js', staticOptions));
app.use('/assets/css', express.static('./public/css', staticOptions));
app.use('/assets/fonts', express.static('./public/fonts', staticOptions));
app.use('/assets/u', express.static('./public/img/u', {
  setHeaders: (res) => {
    return res.setHeader('Content-Type', 'image/jpeg');
  },
}));

// Authentication, session, cookies. (Passport)
app.use(cookieParser('FJ9y5po5aWYGlpFoEDwXeRYMU68TcQWTKNMqu8pU'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

app.use('/graphql', multer({ storage: diskStorage }).fields(fileFields));
app.use('/graphql', graphqlHTTP((req, res) => {
  return {
    schema,
    rootValue: { req, res },
    context: {
      user: req.user || { user_id: null },
      loaders: getLoaders(),
      // loaders: createLoaders(),
    },
    pretty: true,
    graphiql: true,
  };
}));

/* ===== Routes ===== */
// Avatar fallback
app.get('/assets/u/:userId', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/img/u/default.jpg'), {
    headers: {
      'Content-Type': 'image/jpeg',
    },
  });
});

app.get('/', async (req, res) => {
  if (_.get(req.user, 'user_id')) {
    const name = await mysql.getUserById({
      id: req.user.user_id,
    })
    .then(value => value[0].heading);
    res.send(template({ title: name, script: 'HomePage.js' }));
  } else {
    res.send(template({ title: 'AUTOMEMOIRDOLL', script: 'LandingPage.js' }));
  }
});

app.get('/login', (req, res) => {
  res.send(template({ title: 'Login', script: 'LoginPage.js' }));
});
app.get('/register', (req, res) => {
  res.send(template({ title: 'Register', script: 'RegisterPage.js' }));
});
app.get('/payment', (req, res) => {
  res.send(template({ title: 'Payment settings', script: 'PaymentPage.js' }));
});
app.get('/faq', (req, res) => {
  res.send(template({ title: 'FAQ', script: 'FaqPage.js' }));
});
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.get('/new', async (req, res, next) => {
  if (req.user) {
    res.send(template({ title: 'New memory', script: 'DraftingPage.js' }));
  } else {
    next('Not logged in.');
  }
});
app.get('/insights', (req, res, next) => {
  if (req.user) {
    res.send(template({ title: 'Insights', script: 'InsightsPage.js' }));
  } else {
    next('Not logged in.');
  }
});

app.get('/:memory_id', async (req, res, next) => {
  if (req.user) {
    res.send(template({ title: req.params.memory_id, script: 'MemoryPage.js' }));
  } else {
    next('Not logged in.');
  }
});
app.get('/:memory_id/edit', (req, res, next) => {
  if (req.user) {
    res.send(template({ title: `Edit - ${req.params.memory_id}`, script: 'MemoryEditPage.js' }));
  } else {
    next('Not logged in.');
  }
});

app.get('/tag/:tag', (req, res, next) => {
  if (req.user) {
    res.send(template({ title: `#${req.params.tag}`, script: 'TagPage.js' }));
  } else {
    next('Not logged in.');
  }
});

app.get('/settings/account', (req, res, next) => {
  if (req.user) {
    res.send(template({ title: 'Account', script: 'SettingsAccountPage.js' }));
  } else {
    next('Not logged in.');
  }
});
app.get('/settings/password', (req, res, next) => {
  if (req.user) {
    res.send(template({ title: 'Password', script: 'SettingsPasswordPage.js' }));
  } else {
    next('Not logged in.');
  }
});
app.get('/settings/subscription', (req, res, next) => {
  if (req.user) {
    res.send(template({ title: 'Subscription', script: 'SettingsSubscriptionPage.js' }));
  } else {
    next('Not logged in.');
  }
});
app.use((err, req, res, next) => {
  res.status(404);
  res.send(template({ title: '404 - Page not found', script: 'ErrorPage.js' }));
});

/* ===== Post Routes ===== */
app.post('/login', passport.authenticate(
  'local',
  {
    successRedirect: '/',
    failureRedirect: '/login',
  }
));

if (process.env.NODE_ENV === 'production') {
  https.createServer({
    key: privateKey,
    cert: publicKey,
  }, app).listen(PORT);
  appHttp.get('*', (req, res) => {
    res.redirect(`${domain}${req.url}`);
  });
  appHttp.listen(80);
} else {
  app.listen(PORT, () => {
    console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`Listening on port: ${PORT}`);
  });
}

// app.listen(PORT, () => {
//   console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
//   console.log(`Listening on port: ${PORT}`);
// });
