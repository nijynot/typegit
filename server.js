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
const mysql = require('./src/config/mysql.js');
const constants = require('./src/config/constants.js');

// Redis Client
const client = redis.createClient();
client.select(4);
const imageClient = redis.createClient();
imageClient.select(4);

// Authentication
const passport = require('passport');
require('./src/config/authentication/passport.js');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// GraphQL
const schema = require('./lib/schema/schema.js');
const getLoaders = require('./lib/schema/loaders/getLoaders.js');
const template = require('./src/views/template.js');

// Routes
const repository = require('./routes/repository.js');
const settings = require('./routes/settings.js');
const gitHttp = require('./routes/git-http.js');

/* ===== Constants and Helpers ===== */

let PORT;
let privateKey;
let publicKey;
let domain;

if (process.env.NODE_ENV === 'production') {
  PORT = constants.HTTPS_PORT;
  domain = constants.DOMAIN;
  privateKey = fs.readFileSync(constants.LETSENCRYPT_SK);
  publicKey = fs.readFileSync(constants.LETSENCRYPT_PK);
} else {
  PORT = constants.DEV_PORT;
  domain = 'http://localhost:8080';
}

const staticOptions = {
  setHeaders: (res) => {
    if (process.env.NODE_ENV === 'production') {
      return res.set({
        'Content-Encoding': 'gzip',
        'Content-Type': 'application/javascript',
      });
    }
    return null;
  },
};

const redisOptions = {
  client,
  host: 'localhost',
  port: constants.REDIS_PORT,
};

const sessionOptions = {
  name: 'local',
  store: new RedisStore(redisOptions),
  saveUninitialized: true,
  resave: false,
  secret: constants.SESSION_SK,
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
if (process.env.NODE_ENV !== 'production') {
  app.use('/.well-known/acme-challenge', express.static('./.well-known/acme-challenge'));
}
app.use('/assets', express.static('./public/js', staticOptions));
app.use('/assets/css', express.static('./public/css'));
app.use('/assets/fonts', express.static('./public/fonts'));
app.use('/assets/etc', express.static('./public/img/etc', {
  setHeaders: (res) => {
    return res.set('Content-Type', 'image/jpeg');
  },
}));
app.use('/assets/u', express.static('./public/img/u', {
  setHeaders: (res) => {
    return res.set('Content-Type', 'image/jpeg');
  },
}));
app.use('/assets/img/:uuid', (req, res, next) => {
  const { uuid } = req.params;
  const first = uuid.substring(0, 2);
  const second = uuid.substring(2, 4);
  const third = uuid.substring(4, 6);

  imageClient.get(uuid, (err, reply) => {
    if (err) console.error(err);
    res.set('Content-Type', reply);
    res.sendFile(`./public/img/img/${first}/${second}/${third}/${uuid}`, {
      root: __dirname,
    });
  });
});
// app.use('/assets/img', express.static('./public/img/img'));

// Authentication, session, cookies. (Passport)
app.use(cookieParser(constants.SESSION_SK));
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
app.get('/favicon.ico', (req, res) => {
  res.status(204);
});

app.get('/', async (req, res) => {
  if (_.get(req.user, 'user_id')) {
    const name = await mysql.getUserById({
      id: req.user.user_id,
    })
    .then(value => value[0].heading);
    res.send(template({ title: name || 'Typegit', script: 'HomePage.js' }));
  } else {
    res.send(template({ title: 'Typegit', script: 'LandingPage.js' }));
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
app.get('/example', (req, res) => {
  res.send(template({ title: 'Example', script: 'ExamplePage.js' }));
});
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.get('/new', async (req, res, next) => {
  if (req.user) {
    res.send(template({ title: 'New post', script: 'DraftingPage.js' }));
  } else {
    next('Not logged in.');
  }
});
// app.get('/insights', (req, res, next) => {
//   if (req.user) {
//     res.send(template({ title: 'Insights', script: 'InsightsPage.js' }));
//   } else {
//     next('Not logged in.');
//   }
// });
app.get('/images', (req, res, next) => {
  if (req.user) {
    // res.send(template({ title: 'Insights', script: 'InsightsPage.js' }));
  } else {
    next('Not logged in.');
  }
});

// app.use('/:repo.git', (req, res) => {
//   console.log(req.params);
//   res.send('end');
// });

app.use('/', gitHttp);
app.use('/', repository);

app.get('/tag/:tag', (req, res, next) => {
  if (req.user) {
    res.send(template({ title: `#${req.params.tag}`, script: 'TagPage.js' }));
  } else {
    next('Not logged in.');
  }
});

app.use('/settings', settings);

/* ===== Post Routes ===== */
app.post('/login', passport.authenticate(
  'local',
  {
    successRedirect: '/',
    failureRedirect: '/login',
  }
));

// app.use('*', (req, res) => {
//   console.log('GET WILDCARD', req.originalUrl);
//   console.log('X', req.method);
//   res.send('asdf');
// });

app.use((err, req, res) => {
  console.log('ERROR');
  res.status(404);
  res.send(template({ title: '404 - Page not found', script: 'ErrorPage.js' }));
});

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
