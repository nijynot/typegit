import getMemoryLoader from './getMemoryLoader.js';
import getTagLoader from './getTagLoader.js';
import getUserLoader from './getUserLoader.js';
import getImageLoader from './getImageLoader.js';
import getRepositoryLoader from './getRepositoryLoader.js';
import getRefLoader from './getRefLoader.js';
import getGitObjectLoader from './getGitObjectLoader.js';
import getBlobLoader from './getBlobLoader.js';
import getCommitLoader from './getCommitLoader.js';
import getTreeLoader from './getTreeLoader.js';
import getTreeEntryLoader from './getTreeEntryLoader.js';

module.exports = () => {
  return {
    Memory: getMemoryLoader(),
    Tag: getTagLoader(),
    User: getUserLoader(),
    Image: getImageLoader(),
    Repository: getRepositoryLoader(),
    Ref: getRefLoader(),
    GitObject: getGitObjectLoader(),
    Blob: getBlobLoader(),
    Commit: getCommitLoader(),
    Tree: getTreeLoader(),
    TreeEntry: getTreeEntryLoader(),
  };
};
