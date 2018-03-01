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
import {
  fromGlobalId,
  offsetToCursor,
} from 'graphql-relay';
import { promisify } from 'util';
import _ from 'lodash';
import fs from 'fs-extra';
import path from 'path';
import readChunk from 'read-chunk';
import fileType from 'file-type';

import mysql from '../../config/mysql.js';
import { client } from '../../config/redis.js';

import { isOwner, isLoggedIn } from '../helpers.js';
import { imageConnection, imageEdge } from '../types/imageType.js';

const moveUuid = (src, uuid, dest) => {
  const first = uuid.substring(0, 2);
  const second = uuid.substring(2, 4);
  const third = uuid.substring(4, 6);

  fs.ensureDirSync(`./public/img/img/${first}/${second}/${third}`);
  fs.moveSync(src, path.join(dest, first, second, third, uuid));
};

export const newImagePayload = new GraphQLObjectType({
  name: 'NewImagePayload',
  fields: () => ({
    images: {
      type: imageConnection,
    },
    imageEdge: {
      type: imageEdge,
    },
  }),
});

export const newImageMutation = {
  name: 'NewImagePayload',
  type: newImagePayload,
  args: {
  },
  resolve: async (rootValue, args, context) => {
    const setAsync = promisify(client.set).bind(client);
    const file = _.get(rootValue, 'req.files.file[0]', []);
    const { size } = file;
    const tmpPath = file.path;

    const { mime } = fileType(readChunk.sync(tmpPath, 0, 4100));
    if (
      isLoggedIn(context) &&
      (mime === 'image/png' || mime === 'image/jpeg' || mime === 'image/gif') &&
      (size / 1000000) <= 10
    ) {
      console.log(file.filename);
      await moveUuid(tmpPath, file.filename, './public/img/img');
      await mysql.insertImage({
        uuid: file.filename,
        user_id: context.user.user_id,
      });
      return {
        imageEdge: {
          node: {
            id: file.filename,
            user_id: context.user.user_id,
          },
          cursor: offsetToCursor(-1),
        },
      };
    }
  },
};
