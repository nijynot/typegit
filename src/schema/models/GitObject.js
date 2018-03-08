// import get from 'lodash/get';
// import mysql from '../../config/mysql.js';
import path from 'path';
import _ from 'lodash';
import nodegit from 'nodegit';
import * as git from '../git.js';
import { Repository } from './Repository.js';
import { Blob } from './Blob.js';

const viewerCanSee = (context, data) => {
  return (context.user.user_id === data.user_id);
};

export class GitObject {
  constructor(data) {
    // this.id = data.id;
    // this.user_id = data.user_id;
    // this.created = data.created;
  }

  // static async gen(context, id) {
  //   let data;
  //   try {
  //     if (id) {
  //       data = await context.loaders.Blob.load(id);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  //   return viewerCanSee(context, data) ? new Blob(data) : this.null();
  // }

  static async expression(context, { repository, expression }) {
    const repositoryId = _(path.join(repository.path(), '..').split(path.sep)).last();
    const repo = await Repository.gen(context, repositoryId);
    let gitObject;
    if (repo.user_id === context.user.user_id) {
      gitObject = await git.parseExp(repository, expression);
    }

    if (gitObject instanceof nodegit.Blob) {
      return new Blob({
        id: gitObject.id().toString(),
        partialOid: gitObject.id().toString().substr(0, 6),
        byteSize: gitObject.rawsize(),
        isBinary: gitObject.isBinary(),
        oid: gitObject.id().toString(),
        text: gitObject.content(),
      });
    }
    return (viewerCanSee(context, repo)) ? gitObject : this.null();
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
