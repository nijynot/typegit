import DataLoader from 'dataloader';
import mysql from '../../config/mysql.js';
import get from 'lodash/get';

exports.getLoader = () => {
  return new DataLoader(ids => mysql.getUsersByIds({ ids }));
};

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
      data = await context.loaders.UserLoader.load(id);
    } catch (err) {
      return null;
    }
    return viewerCanSee(context, data) ? new User(data) : null;
  }

  static async clear(context, id) {
    context.loaders.UserLoader.clear(id);
  }
}
