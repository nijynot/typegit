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
import _ from 'lodash';

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
      // resolve: (rootValue) => {
      //   if (rootValue.custom_title !== 0) {
      //     return rootValue.title;
      //   }
      //   return _.get(rootValue.body.match(/(#{1,6})(.*)/), '[2]', null);
      // },
    },
    body: {
      type: GraphQLString,
    },
    custom_title: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    custom_created: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    created: {
      type: new GraphQLNonNull(GraphQLString),
    },
    user: {
      type: new GraphQLNonNull(userType),
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
