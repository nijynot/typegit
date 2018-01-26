import DataLoader from 'dataloader';
import mysql from '../../config/mysql.js';
import { User } from '../models/User.js';

module.exports = () => {
  return new DataLoader(async (ids) => {
    const res = await mysql.getUsersByIds({ ids });
    return res.map(data => new User(data));
  });
};
