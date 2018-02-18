import DataLoader from 'dataloader';
import get from 'lodash/get';
import mysql from '../../config/mysql.js';

exports.getLoader = () => {
  return new DataLoader(ids => mysql.getMemoriesByIds({ ids }));
};

const viewerCanSee = (context, data) => {
  if (
    parseInt(get(context, 'user.user_id'), 10) ===
    parseInt(get(data, 'user_id'), 10)
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
        data = await context.loaders.MemoryLoader.load(id);
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
      });
      return array;
    }
    return [];
  }

  static async null(context, id) {
    return { id };
  }

  static async clear(context, id) {
    context.loaders.MemoryLoader.clear(id);
  }
}
