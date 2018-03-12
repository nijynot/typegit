import get from 'lodash/get';
import { getOffsetWithDefault } from 'graphql-relay';

import mysql from '../../config/mysql.js';
import { Image } from './Image.js';

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
    return viewerCanSee(context, data) ? new User(data) : this.null();
  }

  static async idByUsername(context, username) {
    const user = await mysql.getUserByUsername({
      username,
    });
    return get(user, '[0].id');
  }

  static async images(context, args, id) {
    if (context.user.user_id === id) {
      const images = await mysql.getImageIdsByUserId({
        user_id: context.user.user_id,
        limit: args.first + 1,
        offset: getOffsetWithDefault(args.after, -1) + 1,
      })
      .then(rows => rows.map(row => Image.gen(context, row.id)));
      return images;
    }
    return [];
  }

  static async null() {
    return new User({ id: null });
  }

  static async clear(context, id) {
    context.loaders.User.clear(id);
  }
}
