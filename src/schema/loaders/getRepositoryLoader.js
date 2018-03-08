import DataLoader from 'dataloader';
import mysql from '../../config/mysql.js';
import { Repository } from '../models/Repository.js';

module.exports = () => {
  return new DataLoader(async (ids) => {
    const res = await mysql.getRepositoriesByIds({ ids });
    return res.map(data => new Repository(data));
  });
};
