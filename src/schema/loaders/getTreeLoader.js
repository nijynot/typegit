import DataLoader from 'dataloader';
import mysql from '../../config/mysql.js';
import * as git from '../git.js';

module.exports = () => {
  return new DataLoader(async (keys) => {
    const promises = keys.map(({ repository, id }) => {
      return repository.getTree(id);
    });
    return Promise.all(promises);
  }, {
    cacheKeyFn: (key) => {
      return Object.keys(key).sort().map(k => `${k}:${key[k]}`).join();
    },
  });
};
