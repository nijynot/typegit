// import get from 'lodash/get';
// import mysql from '../../config/mysql.js';
import path from 'path';
import _ from 'lodash';
import * as git from '../git.js';
import { Repository } from './Repository.js';

const viewerCanSee = (context, data) => {
  return (context.user.user_id === data.user_id);
};

const resolveType = (type) => {
  if (type === 0) {
    return 'ext1';
  } else if (type === 1) {
    return 'commit';
  } else if (type === 2) {
    return 'tree';
  } else if (type === 3) {
    return 'blob';
  } else if (type === 4) {
    return 'tag';
  } else if (type === 5) {
    return 'ext2';
  } else if (type === 6) {
    return 'ofs_delta';
  } else if (type === 7) {
    return 'ref_delta';
  } else if (type === -2) {
    return 'any';
  } else if (type === -1) {
    return 'bad';
  }
  return 'unreadable';
};

export class TreeEntry {
  constructor(data) {
    this.partialOid = data.partialOid;
    this.oid = data.oid;
    this.mode = data.mode;
    this.name = data.name;
    this.type = data.type;
    this.git = data.git;
    this.tree = data.tree;
  }

  static async gen(context, { tree, id }) {
    const repositoryId = path.parse(tree.owner().path()).name;
    const repo = await Repository.gen(context, repositoryId);
    let data;
    try {
      if (id) {
        data = await context.loaders.TreeEntry.load({ tree, id });
      }
    } catch (err) {
      console.log(err);
    }
    if (repo.user_id === context.user.user_id) {
      return new TreeEntry({
        partialOid: data.oid().substr(0, 6),
        oid: data.oid(),
        mode: data.filemode(),
        name: data.name(),
        type: resolveType(data.type()),
        git: data,
        tree,
      });
    }
    return this.null();
  }

  static async entryByName(context, { tree, name }) {
    const entry = tree.entryByName(name);
    return this.gen(context, { tree, id: entry.sha() });
  }

  static async null() {
    return new TreeEntry({
      id: this.id,
      user_id: null,
      created: null,
    });
  }

  static async clear(context, id) {
    context.loaders.Tree.clear(id);
  }
}
