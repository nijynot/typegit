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

  static async gen(context, { repo, id }) {
    let gitObject;
    try {
      if (repo && id) {
        gitObject = await context.loaders.GitObject.load({ repo, id });
      }
    } catch (err) {
      console.log(err);
    }
    if (gitObject.isCommit()) {
      return Commit.gen(context, { repo, id });
    } else if (gitObject.isBlob()) {
      return Blob.gen(context, { repo, id });
    } else if (gitObject.isTree()) {
      return Tree.gen(context, { repo, id });
    }
    return this.null();
  }

  static async expression(context, { repo, expression }) {
    const gitObject = await nodegit.Revparse.single(repo, expression);
    if (gitObject.isBlob()) {
      return Blob.gen(context, { repo, id: gitObject.id() });
    } else if (gitObject.isCommit()) {
      return Commit.gen(context, { repo, id: gitObject.id() });
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
