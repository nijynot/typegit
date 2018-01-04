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
import { globalIdField, fromGlobalId } from 'graphql-base64';
import {
  connectionArgs,
  connectionFromArray,
} from 'graphql-connection';
import validator from 'validator';

import mysql from '../../config/mysql.js';

import { isLoggedIn, isOwner } from '../helpers.js';
import { userType } from './userType.js';
import { memoryType, memoryConnection } from './memoryType.js';
import { tagType } from './tagType.js';

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
    memory: {
      type: memoryType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: (rootValue, args, context) => {
        return Memory.gen(context, args.id);
      },
    },
    tag: {
      type: tagType,
      args: {
        tag: {
          type: GraphQLString,
        },
      },
      resolve: async (rootValue, args, context) => {
        return mysql.getTagByUserIdAndTag({
          user_id: context.user.user_id,
          tag: args.tag,
        })
        .then(value => value[0]);
      },
    },
    memories: {
      type: memoryConnection,
      args: {
        ...connectionArgs,
      },
      resolve: async (rootValue, args, context) => {
        if (isLoggedIn(context)) {
          const array = await mysql.getMemories({
            user_id: context.user.user_id,
            limit: args.limit + 1,
          });
          return connectionFromArray({ array, args });
        }
        return [];
      },
      // type: new GraphQLList(memoryType),
      // resolve: (rootValue, _, session) => {
      //   if (isLoggedIn(session)) {
      //     return mysql.getMemories({
      //       user_id: session.user.user_id,
      //     })
      //     .then((value) => {
      //       return value;
      //     });
      //   }
      //   return [];
      // },
    },
    memoryCount: {
      type: GraphQLInt,
      resolve: (rootValue, args, context) => {

      },
    },
    tagCount: {
      type: GraphQLInt,
      resolve: (rootValue, args, context) => {

      },
    },
    search: {
      type: memoryConnection,
      args: {
        query: {
          type: GraphQLString,
        },
        ...connectionArgs,
      },
      resolve: async (rootValue, args, context) => {
        const array = await mysql.searchMemories({
          user_id: context.user.user_id,
          query: args.query,
          limit: args.limit + 1,
        });
        return connectionFromArray({ array, args });
      },
    },
    usernameIsValid: {
      type: GraphQLBoolean,
      args: {
        username: {
          type: GraphQLString,
        },
      },
      resolve: async (rootValue, args) => {
        const { validate } = await mysql.validateUsername({
          username: args.username,
        })
        .then(value => value[0]);
        if (args.username.length < 1) {
          return null;
        } else if (
          validate ||
          args.username.length > 39 ||
          !validator.isAlphanumeric(args.username)
        ) {
          return false;
        }
        return true;
      },
    },
    emailIsValid: {
      type: GraphQLBoolean,
      args: {
        email: {
          type: GraphQLString,
        },
      },
      resolve: async (rootValue, args) => {
        const { validate } = await mysql.validateEmail({
          username: args.email,
        })
        .then(value => value[0]);
        if (args.email.length < 1) {
          return null;
        } else if (
          validate ||
          args.email.length > 255 ||
          !validator.isEmail(args.email)
        ) {
          return false;
        }
        return true;
      },
    },
  }),
});
