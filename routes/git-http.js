const express = require('express');
const { spawn } = require('child_process');
const passport = require('passport');

const router = express.Router();
const git = require('../lib/schema/git.js');

function pktline(line) {
  console.log('Line-Length:', line.length);
  const size = line.length + 4;
  const head = `0000${size.toString(16)}`.substr(-4, 4);
  return Buffer.from(`${head}${line}`);
}
const ZERO_PKT_LINE = Buffer.from('0000\n');
// const PACK = Buffer.from('PACK');

function authorize() {
  return (req, res, next) => {
    console.log('someone pulled');
    next();
  };
}

router.get('/:repositoryId.git', (req, res) => {
  console.log(req.params);
  res.send('end');
});

// router.get('/:repositoryId.git/:refname', (req, res) => {
//   console.log('GET', req.originalUrl);
//   res.send(req.params.refname);
// });

router.post('/:repositoryId.git/git-receive-pack', (req, res) => {
  console.log('GET@git-receive-pack');
  const { repositoryId } = req.params;
  res.set({
    Expires: 'Fri, 01 Jan 1980 00:00:00 GMT',
    Pragma: 'no-cache',
    'Cache-Control': 'no-cache, max-age=0, must-revalidate',
    'Content-Type': 'application/x-git-receive-pack-result',
  });

  return git.open(repositoryId)
  .then((repo) => {
    const packer = spawn('git', ['receive-pack', '--stateless-rpc', repo.path()]);
    req.pipe(packer.stdin);
    packer.stdout.pipe(res);
    packer.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });
    packer.on('exit', () => res.end());
  });
});

router.post('/:repositoryId.git/git-upload-pack', (req, res) => {
  console.log('GET@git-upload-pack');
  const { repositoryId } = req.params;
  res.set({
    Expires: 'Fri, 01 Jan 1980 00:00:00 GMT',
    Pragma: 'no-cache',
    'Cache-Control': 'no-cache, max-age=0, must-revalidate',
    'Content-Type': 'application/x-git-upload-pack-result',
  });

  return git.open(repositoryId)
  .then((repo) => {
    const packer = spawn('git', ['upload-pack', '--stateless-rpc', repo.path()]);
    req.pipe(packer.stdin);
    packer.stdout.pipe(res);
    packer.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });
    packer.on('exit', () => res.end());
  });
});

router.get('/:repositoryId.git/info/refs', passport.authenticate('basic', { session: false }), (req, res, next) => {
  const { service } = req.query;
  const serviceArg = service.replace('git-', '');
  const { repositoryId } = req.params;
  console.log('GET@/info/refs', req.originalUrl);
  console.log('Service-Meta:', service, serviceArg);
  if (!['git-receive-pack', 'git-upload-pack'].includes(service)) {
    res.status(500).send({ error: 'Service not found.' });
  }

  res.set({
    Pragma: 'no-cache',
    Expires: (new Date('1900')).toISOString(),
    'Cache-Control': 'no-cache, max-age=0, must-revalidate',
    'Content-Type': `application/x-${service}-advertisement`,
  });

  return git.open(repositoryId)
  .then((repo) => {
    const packet = `# service=${service}\n`;
    const length = packet.length + 4;
    const hex = '0123456789abcdef';
    let prefix = hex.charAt((length >> 12) & 0xf);
    prefix += hex.charAt((length >> 8) & 0xf);
    prefix += hex.charAt((length >> 4) & 0xf);
    prefix += hex.charAt(length & 0xf);
    res.write(`${prefix}${packet}0000`);

    const args = [serviceArg, '--stateless-rpc', '--advertise-refs', repo.path()];
    // const packer = spawn('git upload-pack', args, {stdio: ["ignore", res, "pipe"]});
    const packer = spawn('git', args, { stdio: ['ignore', 'pipe', 'pipe'] });
    packer.stdout.pipe(res);
    packer.stderr.on('data', (data) => {
      console.log(`stderr: #${data}`);
    });
    packer.on('exit', () => res.end());
  });
});

module.exports = router;
