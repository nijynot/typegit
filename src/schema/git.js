const git = require('nodegit');
const fs = require('fs-extra');
const moment = require('moment');
const path = require('path');

export const init = async (dir) => {
  await git.Repository.init(path.join('./public/repo/', dir), 0);
};

export const open = async (dir) => {
  const first = dir.substr(0, 2);
  const second = dir.substr(2, 2);
  const dirPath = path.join('./public/repo/', first, second, dir);
  const repository = await git.Repository.open(dirPath);
  return repository;
};

export const add = async (repository, { fileNames }) => {
  // const repo = await git.Repository.open(`./public/repo/${repository}`);
  const index = await repository.refreshIndex();
  fileNames.forEach(async (fileName) => {
    await index.addByPath(fileName);
  });
  await index.write();
  const oid = await index.writeTree();
  return oid;
};

export const createGitActor = (name, email) => {
  return git.Signature.create(name, email, moment().unix(), 0);
};

export const initialCommit = async (repository, { author, commiter, message = 'Initial commit' }) => {
  // const repo = await git.Repository.open(`./public/repo/${repository}`);
  const index = await repository.refreshIndex();
  const oid = await index.writeTree();
  await repository.createCommit('HEAD', author, commiter, message, oid, []);
};

export const commit = async (repository, { author, commiter, message = 'Update file(s)' }) => {
  // const repo = await git.Repository.open(`./public/repo/${repository}`);
  const index = await repository.refreshIndex();
  const oid = await index.writeTree();
  const head = await git.Reference.nameToId(repository, 'HEAD');
  const parent = await repository.getCommit(head);
  await repository.createCommit('HEAD', author, commiter, message, oid, [parent]);
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
