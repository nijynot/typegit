const git = require('nodegit');
const fs = require('fs-extra');
const moment = require('moment');
const path = require('path');
const util = require('util');
const _ = require('lodash');
const loaders = require('./lib/schema/loaders/getLoaders.js');
const { GitObject } = require('./lib/schema/models/GitObject.js');
const normalize = require('normalize-path');

// git init
const init = async () => {
  git.Repository.init('./public/repo/Alice0000001', 0);
};

// Create index.md file
const createFile = async () => {
  await fs.writeFile('./public/repo/Alice0000001/index.md', 'testing!\n')
  .then((res) => {
    console.log(res);
  });
};

// git add index.md
const add = async () => {
  const repo = await git.Repository.open('./public/repo/Alice0000001');
  const index = await repo.refreshIndex();
  await index.addByPath('index.md');
  await index.write();
  const oid = await index.writeTree();
  console.log(oid);
};

// git commit -m <msg> (init)
const commitInit = async () => {
  const repo = await git.Repository.open('./public/repo/Alice0000001');
  const index = await repo.refreshIndex();
  const oid = await index.writeTree();
  console.log(oid);
  // const entries = await index.entries();
  // console.log(entries);
  // const head = await git.Reference.nameToId(repo, 'HEAD');
  // const parent = await repo.getCommit(head);
  const author = git.Signature.create('Tony Jin', 'nijynot@gmail', moment().unix(), 0);
  const commiter = git.Signature.create('Tony Jin', 'nijynot@gmail', moment().unix(), 0);
  // await repo.createCommit('HEAD', author, commiter, 'Second commit', oid, [parent]);
  await repo.createCommit('HEAD', author, commiter, 'Initial commit!', oid, []);
};

// git commit -m <msg>
const commit = async () => {
  const repo = await git.Repository.open('./public/repo/Alice0000001');
  const index = await repo.refreshIndex();
  const oid = await index.writeTree();
  console.log(oid);
  const head = await git.Reference.nameToId(repo, 'HEAD');
  const parent = await repo.getCommit(head);
  const author = git.Signature.create('Tony Jin', 'nijynot@gmail', moment().unix(), 0);
  const commiter = git.Signature.create('Tony Jin', 'nijynot@gmail', moment().unix(), 0);
  await repo.createCommit('HEAD', author, commiter, 'Third commit', oid, [parent]);
};

// git show
const latestDiff = async () => {
  const repo = await git.Repository.open('./public/repo/Al/ic/Alice0000001');
  const headCommit = await repo.getCommit('d8a32f461e86c1f0f827dcffcdc7760f8163030d');
  const diffs = await headCommit.getDiff();
  const patches = await Promise.all(diffs.map((diff) => {
    return diff.patches();
  }));

  console.log(patches);
  // const hunks = await patches.hunks();
  // const lines = await hunks[0].lines();
  // lines.forEach((line) => {
  //   // console.log(line.origin());
  //   // console.log(line.content().trim());
  //   // console.log(line.newLineno());
  //   console.log(String(line.oldLineno()) + ' ' + String(line.newLineno()) + ': ' + String.fromCharCode(line.origin()) + line.content().trim());
  // });
};

const walkHistory = async () => {
  const repo = await git.Repository.open('./public/repo/Al/ic/Alice0000001');
  const com = await repo.getMasterCommit();
  // const com = await repo.getCommit('3af67e44548ad06a0ab7c99be4e3f5e9e980971e');
  const SORT = git.Revwalk.SORT.Time;
  const revwalk = repo.createRevWalk();
  await revwalk.sorting(3);
  revwalk.push(com.id());
  const commits = await revwalk.getCommits(10);
  commits.forEach((c) => {
    console.log(c.sha());
  });
};

// (async () => {
//   const repo = await git.Repository.open('./public/repo/Al/ic/Alice0000001');
//   const masterCommit = await repo.getMasterCommit();
//   const tree = await masterCommit.getTree();
//   const entry = await tree.entryByPath('src/index.js');
//   // console.log(entry);
//   // const blobPath = entry.path();
//   // const blob = await entry.getBlob();
//   console.log(entry.sha());
//   const blob = await repo.getBlob(entry.sha());
//   console.log(blob.toString());
//   // const entries = await tree.entries();
//   // console.log(entries[1].isTree());
//   // const blob = await repo.getBlob('index.md');
//   // console.log(blob);
// })();

const parse = async () => {
  const repo = await git.Repository.open('./public/repo/Al/ic/Alice0000001');
  const obj = await git.Revparse.single(repo, 'master:index.md');
  // const tree = await repo.getTree(obj.id());
  const blob = await repo.getBlob(obj.id());
  console.log(blob instanceof git.Blob);
  // console.log(obj.id().cpy());
  // console.log(tree);
  // console.log(obj.isBlob());
  // console.log(obj.toString());
  // console.log(util.inspect(obj, { depth: null }));
};

const history = async (
  repository,
  {
    sort = git.Revwalk.SORT.TIME,
    count = 10,
    sha, // Optional ´after´ argument
  } = {}
) => {
  // const repo = await git.Repository.open(`./public/repo/${repository}`);
  const revwalk = repository.createRevWalk();
  let headCommit;
  if (sha) {
    headCommit = await repository.getCommit(sha);
  } else {
    headCommit = await repository.getMasterCommit();
  }
  revwalk.sorting(sort);
  revwalk.push(headCommit.id());
  const commits = await revwalk.getCommits(count);
  return commits;
};

// init();
// createFile();
// add();
// commit();
// latestDiff();
// walkHistory();
// parse();

(async () => {
  const repo = await git.Repository.open('./public/repo/Al/ic/Alice0000001');
  // const masterCommit = await repo.getMasterCommit();
  const headCommit = await repo.getCommit('3af67e44548ad06a0ab7c99be4e3f5e9e980971e');
  const tree = await headCommit.getTree();
  // const lders = loaders();
  const blob = await tree.entryByName('index.md').getBlob();
  console.log(blob.toString());
  // const commits = await history(repo);
  // console.log(commits);
  // const obj = await lders.Commit.load({ repository: repo, id: '44a441ca4f8c7ec528f0ebdd18b68110aa090e84' });
  // const obj = await lders.GitObject.load({ repository: repo, id: 'e8b2f91da1f031223f0b679a0d2a9668419663a9' });
  // console.log(obj);
  // const gitObj = await GitObject.gen({ user: { user_id: 1 } }, { repository: repo, id: 'e8b2f91da1f031223f0b679a0d2a9668419663a9' });
  // console.log(gitObj);
  // const split = path.join(repo.path(), '..').split(path.sep);
  // const dir = _(path.join(repo.path(), '..').split(path.sep)).last();
  // console.log(dir);
})();

// (async () => {
//   await git.Repository.open(path.resolve(__dirname, 'public/repo/Al/ic/Alice0000001'))
//   .then((repo) => {
//     console.log(path.resolve(__dirname, 'public/repo/Al/ic/Alice0000001'));
//     return repo.getHeadCommit();
//   })
//   .then((headCommit) => {
//     return headCommit.getDiff().then(arr => arr[0]);
//   })
//   .then((diff) => {
//     console.log(diff);
//     return diff.patches().then(arr => arr[0]);
//   })
//   .then((patches) => {
//     console.log(patches);
//     return patches.hunks();
//   })
//   .then(async (hunks) => {
//     console.log(hunks[0]);
//     const lines = await hunks[0].lines();
//     lines.forEach((line) => {
//       console.log(String.fromCharCode(line.origin()) + line.content().trim());
//     });
//     console.log(lines);
//   });
//   // console.log(diff[0].getDelta(0).newFile().id());
// })();
