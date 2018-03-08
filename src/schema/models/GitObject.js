// import mysql from '../../config/mysql.js';
import path from 'path';
import _ from 'lodash';
import nodegit from 'nodegit';
import * as git from '../git.js';
import { Repository } from './Repository.js';
import { Blob } from './Blob.js';
import { Commit } from './Commit.js';
import { Tree } from './Tree.js';

const viewerCanSee = (context, data) => {
  return (context.user.user_id === data.user_id);
};

export class GitObject {
  constructor(data) {
    this.id = data.id;
    this.partialOid = data.partialOid;
    this.oid = data.oid;
    this.git = data.git;
  }

  static async gen(context, { repository, id }) {
    let gitObject;
    try {
      if (repository && id) {
        gitObject = await context.loaders.GitObject.load({ repository, id });
      }
    } catch (err) {
      console.log(err);
    }
    if (gitObject.isCommit()) {
      return Commit.gen(context, { repository, id });
    } else if (gitObject.isBlob()) {
      return Blob.gen(context, { repository, id });
    } else if (gitObject.isTree()) {
      return Tree.gen(context, { repository, id });
    }
    return this.null();
  }

  static async expression(context, { repository, expression }) {
    const gitObject = await nodegit.Revparse.single(repository, expression);
    if (gitObject.isBlob()) {
      return Blob.gen(context, { repository, id: gitObject.id() });
    } else if (gitObject.isCommit()) {
      return Commit.gen(context, { repository, id: gitObject.id() });
    }

    return this.null();
  }

  static async null() {
    return new GitObject({
      id: this.id,
      user_id: null,
      created: null,
    });
  }

  // static async clear(context, id) {
  //   context.loaders.Blob.clear(id);
  // }
}
