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
  connectionDefinitions,
  getOffsetWithDefault,
} from 'graphql-relay';

import mysql from '../../config/mysql.js';
import { registerType } from '../definitions/node.js';
import { connectionFromArray } from '../definitions/connectionFromArray.js';
import { transformToForward } from '../definitions/transformToForward.js';
import { isOwner } from '../helpers.js';

import { Memory } from '../models/Memory.js';
import { Tag } from '../models/Tag.js';
import { memoryType, memoryConnection } from './memoryType.js';

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
        const { first, after } = transformToForward(args);
        const array = await mysql.getMemoryIdsByTagAndUserId({
          tag: rootValue.tag,
          user_id: context.user.user_id,
          limit: first + 1,
          offset: getOffsetWithDefault(after, -1) + 1,
        })
        .then(rows => rows.map(row => Memory.gen(context, row.id)));
      return connectionFromArray(array, { first, after });
      },
    },
  }),
}));

export const { connectionType: tagConnection } = connectionDefinitions({
  nodeType: tagType,
});
