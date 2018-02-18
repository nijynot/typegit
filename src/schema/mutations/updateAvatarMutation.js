import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';
import _ from 'lodash';
import fs from 'fs-extra';
import path from 'path';
import readChunk from 'read-chunk';
import fileType from 'file-type';
import sharp from 'sharp';

import mysql from '../../config/mysql.js';
import { userType } from '../types/userType.js';
import { isOwner, isLoggedIn } from '../helpers.js';

export const updateAvatarMutation = {
  type: userType,
  args: {
  },
  resolve: async (rootValue, args, context) => {
    const file = _.get(rootValue, 'req.files.file[0]', []);
    const { size } = file;
    const tmpPath = file.path;

    const buffer = readChunk.sync(tmpPath, 0, 4100);
    const { mime } = fileType(buffer);

    if (
      isLoggedIn(context) &&
      (mime === 'image/png' || mime === 'image/jpeg') &&
      ((size / 1000) <= 5000)
    ) {
      const uPath = path.join(__dirname, '../..', `/public/img/u/${context.user.user_id}`);
      fs.moveSync(tmpPath, uPath, { overwrite: true });
      const fileBuffer = fs.readFileSync(uPath);
      return sharp(fileBuffer)
      .resize(500, 500)
      .toFormat('jpeg', { quality: 95 })
      .toFile(uPath, async () => {
        const user = await mysql.getUserById({
          id: context.user.user_id,
        })
        .then(value => value[0]);
        return user;
      });
    }
    fs.unlinkSync(tmpPath);
    return null;
  },
};
