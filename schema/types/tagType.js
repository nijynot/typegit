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

import {
  globalIdField,
  connectionArgs,
  connectionFromArray,
  connectionDefinitions,
} from 'graphql-relay';

import { registerType } from '../definitions/node.js';

import mysql from '../../config/mysql.js';

import { isOwner } from '../helpers.js';

import { memoryType, memoryConnection } from './memoryType.js';

import { Memory } from '../models/Memory.js';
import { Tag } from '../models/Tag.js';

export const tagType = registerType(new GraphQLObjectType({
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
          return Tag.count(context, rootValue.id);
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
          limit: args.first + 1,
        })
        .then(rows => rows.map(row => Memory.gen(context, row.id)));
        return connectionFromArray(array, args);
      },
    },
  }),
}));

export const { connectionType: tagConnection } = connectionDefinitions({
  nodeType: tagType,
});
