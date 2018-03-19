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

export class Ref {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.prefix = data.prefix;
    this.target = data.target;
    this.git = data.git;
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

  static async defaultBranchRef(context, { repo }) {
    const repositoryId = path.parse(repo.path()).name;
    const wrappedRepo = await Repository.gen(context, repositoryId);
    // // const repo = await Repository.gen(context, repositoryId);
    // // let gitObject;
    // // if (repo.user_id === context.user.user_id) {
    // //   gitObject = await git.parseExp(repository, expression);
    // // }
    // const ref = await repository.getReference('refs/heads/master');
    //
    // if (
    //   ref instanceof nodegit.Reference &&
    //   repo.user_id === context.user.user_id
    // ) {
    //   return new Ref({
    //     id: `${repositoryId}:${ref.name()}`,
    //     name: ref.name(),
    //     shorthand: ref.shorthand(),
    //     repositoryId,
    //     target: ref.target(),
    //   });
    // }
    let data;
    try {
      data = await context.loaders.Ref.load({
        repo,
        name: 'refs/heads/master',
      });
    } catch (e) {
      console.log(e);
    }
    if (wrappedRepo.user_id === context.user.user_id) {
      return new Ref({
        id: `${repositoryId}:${data.name()}`,
        name: data.name(),
        shorthand: data.shorthand(),
        target: data.target(),
        git: data,
      });
    }
    return this.null();
  }

  static async null() {
    return new Ref({
      id: this.id,
      name: null,
      shorthand: null,
      repository: null,
      target: null,
    });
  }

  // static async clear(context, id) {
  //   context.loaders.Blob.clear(id);
  // }
}
