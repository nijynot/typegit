// import get from 'lodash/get';
// import mysql from '../../config/mysql.js';
import * as git from '../git.js';

const viewerCanSee = (context, data) => {
  return (context.user.user_id === data.user_id);
};

export class Blob {
  constructor(data) {
    this.id = data.id;
    this.partialOid = data.partialOid;
    this.byteSize = data.byteSize;
    this.isBinary = data.isBinary;
    this.isTruncated = data.isTruncated;
    this.oid = data.oid;
    this.text = data.text;
  }

  // static async gen(context, id) {
  //   let data;
  //   try {
  //     if (id) {
  //       data = await context.loaders.Blob.load(id);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  //   return viewerCanSee(context, data) ? new Blob(data) : this.null();
  // }

  static async null() {
    return new Blob({
      id: this.id,
      user_id: null,
      created: null,
    });
  }

  static async clear(context, id) {
    context.loaders.Blob.clear(id);
  }
}
