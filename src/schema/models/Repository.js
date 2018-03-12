// import get from 'lodash/get';
// import mysql from '../../config/mysql.js';
import * as git from '../git.js';
import _ from 'lodash';
import path from 'path';

const viewerCanSee = (context, data) => {
  return (context.user.user_id === data.user_id);
};

export class Repository {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.auto_title = data.auto_title;
    this.description = data.description;
    this.created = data.created;
    this.auto_created = data.auto_created;
    this.user_id = data.user_id;
    this.git = data.git;
  }

  static async gen(context, id) {
    let data;
    try {
      if (id) {
        data = await context.loaders.Repository.load(id);
      }
    } catch (err) {
      console.log(err);
    }
    return viewerCanSee(context, data) ? new Repository(data) : this.null();
  }

  static async null() {
    return new Repository({
      id: this.id,
      user_id: null,
      created: null,
      git: null,
    });
  }

  static async clear(context, id) {
    context.loaders.Repository.clear(id);
  }
}
