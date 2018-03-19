const git = require('nodegit');
const fs = require('fs-extra');
const moment = require('moment');
const path = require('path');
const util = require('util');
const _ = require('lodash');
const loaders = require('./lib/schema/loaders/getLoaders.js');
const { GitObject } = require('./lib/schema/models/GitObject.js');
const normalize = require('normalize-path');

function padDir(dir) {
  const first = dir.substr(0, 2);
  const second = dir.substr(2, 2);
  return path.join(first, second, dir);
}

async function bareInit(name) {
  const repoDir = 'public/repo/' + name;
  await fs.ensureDir(repoDir);
  const repository = await git.Repository.init(repoDir, 1);
  return repository;
}

const bareOpen = async (name) => {
  const repoDir = 'public/repo/' + name;
  const repository = await git.Repository.openBare(repoDir);
  return repository;
};

const hashObject = async (repo, { data, len, type }) => {
  console.log(data, len, type);
  console.log(data.toString());
  const odb = await repo.odb();
  const oid = await odb.write(data, len, type)
  .catch(err => console.log(err));
  return oid;
};

const updateIndex = async (repo, { source, filename, id, filemode }) => {
  const builder = await git.Treebuilder.create(repo, source)
  .catch(err => console.log(err));
  await builder.insert(filename, id, filemode);
  return builder.write();
};

const createGitActor = (name, email) => {
  return git.Signature.create(name, email, moment().unix(), 0);
};

const commit = async (repo, { updateRef, author, committer, message, tree, parents }) => {
  const oid = await repo.createCommit(updateRef, author, committer, message, tree, parents);
  return oid;
};

const history = async (
  repository,
  {
    sort = git.Revwalk.SORT.TIME,
    reverse = git.Revwalk.SORT.NONE,
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
  revwalk.sorting(sort, reverse);
  revwalk.push(headCommit.id());
  const commits = await revwalk.getCommits(count);
  return commits;
};

// const commit = async (repo, { updateRef, author, committer, message, tree }) => {
//   const head = await git.Reference.nameToId(repo, 'HEAD');
//   const parent = await repo.getCommit(head);
//   const oid = await repo.createCommit(updateRef, author, committer, message, tree, [parent]);
//   return oid;
// };

(async () => {
  // const repo = await bareInit('oL7epwEJ8zbx');
  const content = 'test content, some additions.';
  const repo = await bareOpen('oL7epwEJ8zbx');
  const headCommit = await repo.getHeadCommit();
  const headTree = await headCommit.getTree();

  const objId = await hashObject(repo, {
    data: content,
    len: content.length,
    type: 3,
  });
  const treeId = await updateIndex(repo, {
    source: null,
    filename: 'test.md',
    id: objId,
    filemode: 100644,
  });
  console.log(parseInt('0100644', 10));
  console.log(objId);
  console.log(treeId);
  const actor = await createGitActor('test', 'test@example.com');
  const commitId = await commit(repo, {
    updateRef: 'refs/heads/master',
    author: actor,
    committer: actor,
    message: 'Commit to master',
    tree: treeId,
    parents: [headCommit],
  });
  console.log(commitId);
})();
