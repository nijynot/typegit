import path from 'path';
import { Repository } from './Repository.js';

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
    this.git = data.git;
  }

  static async gen(context, { repository, id }) {
    const repositoryId = path.parse(path.join(repository.path(), '..')).name;
    const repo = await Repository.gen(context, repositoryId);
    let data;
    try {
      if (id) {
        data = await context.loaders.Blob.load({ repository, id });
      }
    } catch (err) {
      console.log(err);
    }
    if (viewerCanSee(context, repo)) {
      return new Blob({
        id,
        partialOid: data.id().toString().substr(0, 6),
        byteSize: data.rawsize(),
        isBinary: data.isBinary(),
        oid: data.id().toString(),
        text: data.content(),
        git: data,
      });
    }
    return this.null();
  }

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
