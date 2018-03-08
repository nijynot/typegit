// import get from 'lodash/get';
// import mysql from '../../config/mysql.js';
import path from 'path';
import _ from 'lodash';
import * as git from '../git.js';
import { Repository } from './Repository.js';

const viewerCanSee = (context, data) => {
  return (context.user.user_id === data.user_id);
};

export class Tree {
  constructor(data) {
    this.id = data.id;
    this.partialOid = data.partialOid;
    this.oid = data.oid;
    this.git = data.git;
  }

  static async gen(context, { repository, id }) {
    const repositoryId = _(path.join(repository.path(), '..').split(path.sep)).last();
    const repo = await Repository.gen(context, repositoryId);
    let data;
    try {
      if (id) {
        data = await context.loaders.Tree.load({ repository, id });
      }
    } catch (err) {
      console.log(err);
    }
    if (viewerCanSee(context, repo)) {
      return new Tree({
        id,
        partialOid: data.id().toString().substr(0, 6),
        oid: data.id().toString(),
        git: data,
      });
    }
    return this.null();
  }

  static async null() {
    return new Tree({
      id: this.id,
      user_id: null,
      created: null,
    });
  }

  static async clear(context, id) {
    context.loaders.Tree.clear(id);
  }
}
