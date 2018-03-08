// import get from 'lodash/get';
// import mysql from '../../config/mysql.js';
import nodegit from 'nodegit';
import path from 'path';
import * as git from '../git.js';
import { Repository } from './Repository.js';

const viewerCanSee = (context, data) => {
  return (context.user.user_id === data.user_id);
};

export class Commit {
  constructor(data) {
    this.id = data.id;
    this.partialOid = data.partialOid;
    this.oid = data.oid;
    this.additions = data.additions;
    this.changedFiles = data.changedFiles;
    this.commitedDate = data.commitedDate;
    this.deletions = data.deletions;
    this.message = data.message;
    this.messageBody = data.messageBody;
    this.messageHeadline = data.messageHeadline;
    this.git = data.git;
  }

  static async gen(context, { repository, id }) {
    const repositoryId = path.parse(path.join(repository.path(), '..')).name;
    const repo = await Repository.gen(context, repositoryId);
    let data;
    try {
      if (id) {
        data = await context.loaders.Commit.load({ repository, id });
      }
    } catch (err) {
      console.log(err);
    }
    if (viewerCanSee(context, repo)) {
      return new Commit({
        id,
        partialOid: data.id().toString().substr(0, 6),
        oid: data.id().toString(),
        commitedDate: data.date(),
        message: data.message(),
        git: data,
      });
    }
    return this.null();
  }

  static async wrap(context, { repository, commit }) {
    const repositoryId = path.parse(path.join(repository.path(), '..')).name;
    const repo = await Repository.gen(context, repositoryId);
    if (viewerCanSee(context, repo)) {
      return new Commit({
        id: commit.sha(),
        partialOid: commit.sha().substr(0, 6),
        oid: commit.sha(),
        commitedDate: commit.date(),
        message: commit.message(),
        git: commit,
      });
    }
    return this.null();
  }

  static async null() {
    return new Commit({
      id: this.id,
      user_id: null,
      created: null,
    });
  }

  static async clear(context, id) {
    context.loaders.Commit.clear(id);
  }
}
