import DataLoader from 'dataloader';
import mysql from '../../config/mysql.js';
import { Tag } from '../models/Tag.js';

module.exports = () => {
  return new DataLoader(async ids => [ids].map(id => new Tag({ id, tag: id })));
};
