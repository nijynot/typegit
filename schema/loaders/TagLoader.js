import DataLoader from 'dataloader';
import get from 'lodash/get';
import mysql from '../../config/mysql.js';

exports.getLoader = () => {
  return new DataLoader(ids => mysql.getTagsByIds({ ids }));
};

const viewerCanSee = (context, data) => {
  if (get(context, 'user.user_id') === data.user_id) {
    return true;
  }
  return false;
};

export class Tag {
  constructor(data) {
    this.id = data.id;
    this.label = data.label;
    this.color = data.color;
    this.user_id = data.user_id;
  }

  static async gen(context, id) {
    let data;
    try {
      data = await context.loaders.TagLoader.load(id);
    } catch (err) {
      console.log(err);
      return null;
    }
    return viewerCanSee(context, data) ? new Tag(data) : null;
  }
}
