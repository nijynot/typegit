import get from 'lodash/get';
import mysql from '../../config/mysql.js';

const viewerCanSee = (context, data) => {
  if (get(context, 'user.user_id') === get(data, 'id')) {
    return true;
  }
  return false;
};

export class User {
  constructor(data) {
    this.id = data.id;
    this.username = data.username;
    this.heading = data.heading;
    this.email = data.email;
    this.created = data.created;
  }

  static async gen(context, id) {
    let data;
    try {
      data = await context.loaders.User.load(id);
    } catch (err) {
      return null;
    }
    return viewerCanSee(context, data) ? new User(data) : this.null(context, id);
  }

  static async null(context, id) {
    return new User({ id: null });
  }

  static async clear(context, id) {
    context.loaders.User.clear(id);
  }
}
