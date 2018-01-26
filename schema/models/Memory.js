import get from 'lodash/get';
import mysql from '../../config/mysql.js';
import { Tag } from './Tag.js';

const viewerCanSee = (context, data) => {
  if (
    get(context, 'user.user_id', false) ===
    get(data, 'user_id', true)
  ) {
    return true;
  }
  return false;
};

export class Memory {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.body = data.body;
    this.created = data.created;
    this.user_id = data.user_id;
  }

  static async gen(context, id) {
    let data;
    try {
      if (id) {
        data = await context.loaders.Memory.load(id);
      }
    } catch (err) {
      console.log(err);
    }
    return viewerCanSee(context, data) ? new Memory(data) : this.null(context, id);
  }

  static async tags(context, id) {
    const data = await this.gen(context, id);
    if (await viewerCanSee(context, data)) {
      const array = await mysql.getTagsByMemoryId({
        memory_id: id,
      })
      .then(rows => rows.map(row => new Tag(row)));
      return array;
    }
    return [];
  }

  static async null(context, id) {
    return new Memory({ id });
  }

  static async clear(context, id) {
    context.loaders.Memory.clear(id);
  }
}
