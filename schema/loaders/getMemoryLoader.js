import DataLoader from 'dataloader';
import mysql from '../../config/mysql.js';
import { Memory } from '../models/Memory.js';

module.exports = () => {
  return new DataLoader(async (ids) => {
    const res = await mysql.getMemoriesByIds({ ids });
    return res.map(data => new Memory(data));
  });
};
