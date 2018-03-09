import DataLoader from 'dataloader';
import mysql from '../../config/mysql.js';
import { Repository } from '../models/Repository.js';
import * as git from '../git.js';

module.exports = () => {
  return new DataLoader(async (ids) => {
    const items = await mysql.getRepositoriesByIds({ ids });
    const gitPromises = items.map((item) => {
      return git.open(item.id);
    });
    const gitRepos = await Promise.all(gitPromises);
    return items.map((item, i) => new Repository({ ...item, git: gitRepos[i] }));
  });
};
