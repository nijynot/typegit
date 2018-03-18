const express = require('express');

const router = express.Router();
const template = require('../src/views/template.js');

router.get('/account', (req, res, next) => {
  if (req.user) {
    res.send(template({ title: 'Account', script: 'SettingsAccountPage.js' }));
  } else {
    next('Not logged in.');
  }
});
router.get('/password', (req, res, next) => {
  if (req.user) {
    res.send(template({ title: 'Password', script: 'SettingsPasswordPage.js' }));
  } else {
    next('Not logged in.');
  }
});
router.get('/subscription', (req, res, next) => {
  if (req.user) {
    res.send(template({ title: 'Subscription', script: 'SettingsSubscriptionPage.js' }));
  } else {
    next('Not logged in.');
  }
});

module.exports = router;
