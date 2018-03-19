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

import { Repository } from '../models/Repository.js';
import { repositoryConnection } from './repositoryType.js';

export const hashtagType = registerType(new GraphQLObjectType({
  name: 'Hashtag',
  fields: () => ({
    id: globalIdField(),
    hashtag: {
      type: GraphQLString,
    },
    count: {
      type: GraphQLInt,
      resolve: async (rootValue, args, context) => {
        // if (!rootValue.count) {
        //   return Tag.count(context, rootValue.id);
        // }
        // return rootValue.count;
        return 123;
      },
    },
    repositories: {
      type: repositoryConnection,
      args: {
        ...connectionArgs,
      },
      resolve: async (rootValue, args, context) => {
        const { first, after } = transformToForward(args);
        const totalCount = await mysql.getRepositoryCount({
          user_id: context.user.user_id,
        })
        .then(value => value[0].count);
        const array = await mysql.getRepositoryIdsByHashtagAndUserId({
          hashtag: rootValue.hashtag,
          user_id: context.user.user_id,
          limit: first + 1,
          offset: getOffsetWithDefault(after, -1) + 1,
        })
        .then(rows => rows.map(row => Repository.gen(context, row.id)));
        return connectionFromArray(array, { first, after }, {
          totalCount,
        });
      },
    },
  }),
}));

export const { connectionType: hashtagConnection } = connectionDefinitions({
  nodeType: hashtagType,
});
