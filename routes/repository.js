const express = require('express');

const router = express.Router();
const template = require('../src/views/template.js');

router.get('/:repositoryId', async (req, res, next) => {
  if (req.user) {
    res.send(template({ title: req.params.repositoryId, script: 'MemoryPage.js' }));
  } else {
    next('Not logged in.');
  }
});
router.get('/:repositoryId/edit', (req, res, next) => {
  if (req.user) {
    res.send(template({ title: `Edit - ${req.params.repositoryId}`, script: 'MemoryEditPage.js' }));
  } else {
    next('Not logged in.');
  }
});
router.get('/:repositoryId/history', (req, res, next) => {
  if (req.user) {
    res.send(template({ title: `History - ${req.params.repositoryId}`, script: 'HistoryPage.js' }));
  } else {
    next('Not logged in.');
  }
});
router.get('/:repositoryId/commit/:oid', (req, res, next) => {
  if (req.user) {
    res.send(template({ title: `Commit - ${req.params.oid}`, script: 'CommitPage.js' }));
  } else {
    next('Not logged in.');
  }
});


module.exports = router;
