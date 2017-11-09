import DataLoader from 'dataloader';
import mysql from '../../config/mysql.js';
import get from 'lodash/get';

exports.getLoader = () => {
  return new DataLoader(ids => mysql.getMemoriesByIds({ ids }));
};

const viewerCanSee = (context, data) => {
  if (get(context, 'user.user_id') === data.user_id) {
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
      data = await context.loaders.MemoryLoader.load(id);
    } catch (err) {
      console.log(err);
      return null;
    }
    return viewerCanSee(context, data) ? new Memory(data) : null;
  }
}
