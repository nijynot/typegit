import DataLoader from 'dataloader';
import mysql from '../../config/mysql.js';
import { Image } from '../models/Image.js';

module.exports = () => {
  return new DataLoader(async (ids) => {
    const res = await mysql.getImagesByIds({ ids });
    return res.map(data => new Image(data));
  });
};
