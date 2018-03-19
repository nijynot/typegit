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

  static async gen(context, { repo, id }) {
    const repositoryId = path.parse(repo.path()).name;
    const wrappedRepo = await Repository.gen(context, repositoryId);
    let data;
    try {
      if (id) {
        data = await context.loaders.Blob.load({ repo, id });
      }
    } catch (err) {
      console.log(err);
    }
    if (viewerCanSee(context, wrappedRepo)) {
      return new Blob({
        id,
        partialOid: data.id().toString().substr(0, 6),
        byteSize: data.rawsize(),
        isBinary: data.isBinary(),
        oid: data.id().toString(),
        text: data.content().toString(),
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
