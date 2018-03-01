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
  connectionDefinitions,
} from 'graphql-relay';

import { registerType } from '../definitions/node.js';

import mysql from '../../config/mysql.js';

import { isOwner } from '../helpers.js';
import { userType } from './userType.js';
import { tagType, tagConnection } from './tagType.js';

import { Memory } from '../models/Memory.js';
import { User } from '../models/User.js';

export const memoryType = registerType(new GraphQLObjectType({
  name: 'Memory',
  fields: () => ({
    id: globalIdField(),
    title: {
      type: GraphQLString,
    },
    body: {
      type: GraphQLString,
    },
    created: {
      type: GraphQLString,
    },
    user: {
      type: userType,
      resolve: (rootValue, args, context) => {
        return User.gen(context, rootValue.user_id);
      },
    },
    tags: {
      type: new GraphQLList(tagType),
      resolve: async (rootValue, args, context) => {
        return Memory.tags(context, rootValue.id);
      },
    },
  }),
}));

export const { connectionType: memoryConnection } = registerType(connectionDefinitions({
  nodeType: memoryType,
  connectionFields: () => ({
    totalCount: {
      type: GraphQLInt,
    },
  }),
}));
