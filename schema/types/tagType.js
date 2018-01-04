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

import { globalIdField } from 'graphql-base64';
import {
  connectionDefinitions,
  connectionArgs,
  connectionFromArray,
} from 'graphql-connection';
import mysql from '../../config/mysql.js';

import { isOwner } from '../helpers.js';

import { memoryType, memoryConnection } from './memoryType.js';

import { Memory } from '../loaders/MemoryLoader.js';
// import { User } from '../loaders/UserLoader.js';
// import { Tag } from '../loaders/TagLoader.js';

export const tagType = new GraphQLObjectType({
  name: 'Tag',
  fields: () => ({
    id: globalIdField(),
    tag: {
      type: GraphQLString,
    },
    count: {
      type: GraphQLInt,
      resolve: async (rootValue, args, context) => {
        if (!rootValue.count) {
          return mysql.getTagCountByTag({
            user_id: context.user.user_id,
            tag: rootValue.tag,
          })
          .then(value => value[0].count);
        }
        return rootValue.count;
      },
    },
    memories: {
      type: memoryConnection,
      args: {
        ...connectionArgs,
      },
      resolve: async (rootValue, args, context) => {
        const array = await mysql.getMemoryIdsByTagAndUserId({
          tag: rootValue.tag,
          user_id: context.user.user_id,
          limit: args.limit + 1,
        })
        .then(rows => rows.map(row => Memory.gen(context, row.id)));
        return connectionFromArray({ array, args });
      },
    },
  }),
});

export const tagConnection = connectionDefinitions({
  name: 'TagConnection',
  type: tagType,
});
