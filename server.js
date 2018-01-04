const path = require('path');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const multer = require('multer');
const stripe = require('stripe')('sk_test_ZYOq3ukyy4vckadi7twhdL9f');
const _ = require('lodash');
const uuidV4 = require('uuid/v4');
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

/* ===== Constants and Helpers ===== */

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

// Static
app.use('/assets', express.static('./public/js', staticOptions));
app.use('/assets/css', express.static('./public/css', staticOptions));
app.use('/assets/fonts', express.static('./public/fonts', staticOptions));
app.use('/assets/u', express.static('./public/img/u', {
  setHeaders: (res) => {
    return res.setHeader('Content-Type', 'image/jpeg');
  },
}));

// Authentication, session, cookies. (Passport)
app.use(cookieParser('keyboard cat'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

app.use('/graphql', multer({ storage: diskStorage }).fields(fileFields));
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

/* ===== Routes ===== */
// Avatar fallback
app.get('/assets/u/:userId', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/img/u/default.jpg'), {
    headers: {
      'Content-Type': 'image/jpeg',
    },
  });
});

app.get('/', (req, res) => {
  if (_.get(req.user, 'user_id')) {
    res.send(template({ title: 'Diary', script: 'HomePage.js' }));
  } else {
    res.send(template({ title: 'Diary', script: 'LandingPage.js' }));
  }
});

app.get('/login', (req, res) => {
  // res.send('test');
  res.send(template({ title: 'Login', script: 'LoginPage.js' }));
});
app.get('/register', (req, res) => {
  // res.send('test');
  res.send(template({ title: 'Register', script: 'RegisterPage.js' }));
});
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.get('/new', (req, res) => {
  res.send(template({ title: 'New memory', script: 'DraftingPage.js' }));
});

app.get('/insights', (req, res) => {
  res.send(template({ title: 'tag', script: 'InsightsPage.js' }));
});

app.get('/:memory_id', (req, res) => {
  res.send(template({ title: 'Memory', script: 'MemoryPage.js' }));
});
app.get('/:memory_id/edit', (req, res) => {
  res.send(template({ title: 'MemoryEdit', script: 'MemoryEditPage.js' }));
});

app.get('/tag/:tag', (req, res) => {
  res.send(template({ title: 'tag', script: 'TagPage.js' }));
});

app.get('/settings/account', (req, res) => {
  res.send(template({ title: 'Account', script: 'SettingsAccountPage.js' }));
});
app.get('/settings/password', (req, res) => {
  res.send(template({ title: 'Account', script: 'SettingsPasswordPage.js' }));
});
app.get('/settings/subscription', (req, res) => {
  res.send(template({ title: 'Account', script: 'SettingsSubscriptionPage.js' }));
});


/* ===== Post Routes ===== */
app.post('/login', passport.authenticate(
  'local',
  {
    successRedirect: '/',
    failureRedirect: '/login',
  }
));

app.get('/plan/create', (req, res) => {
  stripe.plans.create({
    name: 'test plan',
    id: 'test-plan',
    interval: 'month',
    currency: 'usd',
    amount: '5',
  }, (err, plan) => {
    console.log(err);
    res.json(plan);
  });
});

app.get('/customer/create', (req, res) => {
  stripe.customers.create({
    email: 'nijynot@gmail.com',
    metadata: {
      username: 'asdf',
    },
  }, (err, customer) => {
    console.log(err);
    res.json(customer);
  });
});

app.get('/subscription/create', (req, res) => {
  stripe.subscriptions.create({
    customer: 'cus_C0dI7dl46xOETl',
    items: [
      { plan: 'basic-monthly' },
    ],
  }, (err, subscription) => {
    console.log(err);
    res.json(subscription);
  });
});

app.post('/payments/card', (req, res) => {
  console.log(req.body);
  res.status(200);
  // res.send('ok');
});

app.listen(PORT, () => {
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`Listening on port: ${PORT}`);
});
