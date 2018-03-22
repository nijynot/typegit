import { Blob } from './Blob.js';
import { Commit } from './Commit.js';
import { GitObject } from './GitObject.js';
import { Image } from './Image.js';
import { Ref } from './Ref.js';
import { Repository } from './Repository.js';
import { Tag } from './Tag.js';
import { Tree } from './Tree.js';
import { TreeEntry } from './TreeEntry.js';
import { User } from './User.js';

module.exports = () => {
  return {
    Blob,
    Commit,
    GitObject,
    Image,
    Ref,
    Repository,
    Tag,
    Tree,
    TreeEntry,
    User,
  };
};
