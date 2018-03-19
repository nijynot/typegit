const git = require('nodegit');
const fs = require('fs-extra');
const moment = require('moment');
const path = require('path');

export function padDir(dir) {
  const first = dir.substr(0, 2);
  const second = dir.substr(2, 2);
  return path.join(first, second, dir);
}

export const init = async (dir) => {
  const repoDir = path.join('./public/repo', padDir(dir));
  await fs.ensureDir(repoDir);
  const repository = await git.Repository.init(repoDir, 0);
  return repository;
};

export const open = async (dir) => {
  const repository = await git.Repository.open(path.join('./public/repo', padDir(dir)));
  return repository;
};

export const add = async (repository, { fileNames }) => {
  const index = await repository.refreshIndex();
  const promises = fileNames.map(async (fileName) => {
    return index.addByPath(fileName);
  });
  await Promise.all(promises);
  await index.write();
  const oid = await index.writeTree();
  return oid;
};

export const createGitActor = (name, email) => {
  return git.Signature.create(name, email, moment().unix(), 0);
};

export const initialCommit = async (repository, { author, committer, message = 'Initial commit' }) => {
  // const repo = await git.Repository.open(`./public/repo/${repository}`);
  const index = await repository.refreshIndex();
  const oid = await index.writeTree();
  await repository.createCommit('HEAD', author, committer, message, oid, []);
};

export const commit = async (repository, { author, committer, message = 'Update file(s)' }) => {
  // const repo = await git.Repository.open(`./public/repo/${repository}`);
  const index = await repository.refreshIndex();
  const oid = await index.writeTree();
  const head = await git.Reference.nameToId(repository, 'HEAD');
  const parent = await repository.getCommit(head);
  const commitOid = await repository.createCommit('HEAD', author, committer, message, oid, [parent]);
  return commitOid;
};

export const show = async (repository) => {
  // const repo = await git.Repository.open(`./public/repo/${repository}`);
  const masterCommit = await repository.getMasterCommit();
  const diff = await masterCommit.getDiff().then(arr => arr[0]);
  const patches = await diff.patches().then(arr => arr[0]);
  const hunks = await patches.hunks();
  return hunks[0].lines();
};

export const history = async (
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

export const parseExp = async (repository, expression) => {
  // const repo = await git.Repository.open('./public/repo/Al/ic/Alice0000001');
  const obj = await git.Revparse.single(repository, expression);
  if (obj.isTree()) {
    return repository.getTree(obj.id());
  } else if (obj.isBlob()) {
    return repository.getBlob(obj.id());
  } else if (obj.isCommit()) {
    return repository.getCommit(obj.id());
  }
  return null;
};

export const bareInit = async (name) => {
  const repoDir = path.join('./public/repo', padDir(name));
  await fs.ensureDir(repoDir);
  const repository = await git.Repository.init(repoDir, 1);
  return repository;
};

export const bareOpen = async (name) => {
  const repoDir = path.join('./public/repo', padDir(name));
  const repository = await git.Repository.openBare(repoDir);
  return repository;
};

export const hashObject = async (repo, { data, len, type }) => {
  const odb = await repo.odb();
  const oid = await odb.write(data, len, type)
  .catch(err => console.log(err));
  return oid;
};

export const updateIndex = async (repo, { source, filename, id, filemode }) => {
  const builder = await git.Treebuilder.create(repo, source)
  .catch(err => console.log(err));
  await builder.insert(filename, id, filemode);
  return builder.write();
};

export const commitTree = async (
  repo,
  { updateRef, author, committer, message, tree, parents }
) => {
  const oid = await repo.createCommit(updateRef, author, committer, message, tree, parents);
  return oid;
};
