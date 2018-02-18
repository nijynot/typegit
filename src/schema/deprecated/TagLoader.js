import DataLoader from 'dataloader';
import get from 'lodash/get';
import mysql from '../../config/mysql.js';

exports.getLoader = () => {
  return new DataLoader(ids => [ids]);
};

const viewerCanSee = (context, data) => {
  return true;
};

export class Tag {
  constructor(data) {
    this.id = data.id;
    this.tag = data.tag;
    this.memory_id = data.memory_id;
    this.created = data.created;
  }

  static async gen(context, id) {
    let data;
    try {
      if (id) {
        data = await context.loaders.TagLoader.load(id);
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
    return Tag({ id, tag: id });
  }

  static async clear(context, id) {
    context.loaders.TagLoader.clear(id);
  }
}
