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

import get from 'lodash/get';
import { globalIdField } from 'graphql-base64';

import mysql from '../../config/mysql.js';

import { isLoggedIn, isOwner } from '../helpers.js';
import { userType } from './userType.js';
import { memoryType } from './memoryType.js';

import { Memory } from '../loaders/MemoryLoader.js';

export const viewerType = new GraphQLObjectType({
  name: 'Viewer',
  fields: () => ({
    id: globalIdField(),
    me: {
      type: userType,
      resolve: (rootValue, _, session) => {
        if (isLoggedIn(session)) {
          return mysql.getUserById({
            id: session.user.user_id,
          })
          .then((value) => {
            return value[0];
          });
        }
        return null;
      },
    },
    memories: {
      type: new GraphQLList(memoryType),
      resolve: (rootValue, _, session) => {
        if (isLoggedIn(session)) {
          return mysql.getMemories({
            user_id: session.user.user_id,
          })
          .then((value) => {
            return value;
          });
        }
        return [];
      },
    },
    memory: {
      type: memoryType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: (rootValue, args, context) => {
        return Memory.gen(context, args.id);
        // return mysql.getMemoryByIdAndUserId({
        //   id: args.id,
        //   user_id: get(session, 'user.user_id'),
        // })
        // .then((value) => {
        //   return value[0];
        // });
      },
    },
  }),
});
