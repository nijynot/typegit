import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import get from 'lodash/get';
import { globalIdField } from 'graphql-base64';
import mysql from '../../config/mysql.js';

import { tagType } from './tagType.js';

import { Tag } from '../loaders/TagLoader.js';

export const userType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: globalIdField(),
    username: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLString,
      resolve: (rootValue, _, session) => {
        if (get(session, 'user.user_id') === rootValue.id) {
          return rootValue.email;
        }
        return null;
      },
    },
    tags: {
      type: new GraphQLList(tagType),
      resolve: async (rootValue, args, context) => {
        const tags = await mysql.getTagIdsByUserId({
          user_id: context.user.user_id,
        })
        .then(rows => rows.map(row => Tag.gen(context, row.id)));
        return tags;
      },
    },
  }),
});
