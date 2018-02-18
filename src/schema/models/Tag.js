import get from 'lodash/get';
import mysql from '../../config/mysql.js';

const viewerCanSee = (context, data) => {
  return true;
};

export class Tag {
  constructor(data) {
    this.id = data.id;
    this.tag = data.tag;
  }

  static async gen(context, id) {
    let data;
    try {
      if (id) {
        data = await context.loaders.Tag.load(id);
      }
    } catch (err) {
      console.log(err);
    }
    return viewerCanSee(context, data) ? new Tag(data) : this.null(context, id);
  }

  static async count(context, id) {
    return mysql.getTagCountByTag({
      user_id: context.user.user_id,
      tag: id,
    })
    .then(value => value[0].count);
  }

  static async null(context, id) {
    return new Tag({ id, tag: id });
  }

  static async clear(context, id) {
    context.loaders.Tag.clear(id);
  }
}
