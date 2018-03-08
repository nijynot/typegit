import DataLoader from 'dataloader';
import mysql from '../../config/mysql.js';
import { Repository } from '../models/Repository.js';
import nodegit from 'nodegit';

module.exports = () => {
  return new DataLoader(async (keys) => {
    const promises = keys.map(({ repository, id }) => {
      return nodegit.Object.lookup(repository, id, -2);
    });
    return Promise.all(promises);
  }, {
    cacheKeyFn: (key) => {
      return Object.keys(key).sort().map(k => `${k}:${key[k]}`).join();
    },
  });
};
