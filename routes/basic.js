const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  if (req.user) {
    res.redirect('/');
  } else {
    const app = render(
      // App(null,
      LoginPage()
      // )
    );
    res.send(template({
      title: 'Login',
      body: app,
    }));
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

module.exports = router;
