// import get from 'lodash/get';
// import mysql from '../../config/mysql.js';
import * as git from '../git.js';

const viewerCanSee = (context, data) => {
  return (context.user.user_id === data.user_id);
};

export class Repository {
  constructor(data) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.created = data.created;
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
    });
  }

  static async clear(context, id) {
    context.loaders.Repository.clear(id);
  }
}
