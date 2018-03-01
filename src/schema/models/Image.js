// import get from 'lodash/get';
// import mysql from '../../config/mysql.js';

const viewerCanSee = (context, data) => {
  return (context.user.user_id === data.user_id);
};

export class Image {
  constructor(data) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.created = data.created;
  }

  static async gen(context, id) {
    let data;
    try {
      if (id) {
        data = await context.loaders.Image.load(id);
      }
    } catch (err) {
      console.log(err);
    }
    return viewerCanSee(context, data) ? new Image(data) : this.null();
  }

  static async url(context, id) {
    const data = await this.gen(context, id);
    if (viewerCanSee(context, data)) {
      return `/assets/img/${id}`;
    }
    return null;
  }

  static async null() {
    return new Image({
      id: this.id,
      user_id: null,
    });
  }

  static async clear(context, id) {
    context.loaders.Image.clear(id);
  }
}
