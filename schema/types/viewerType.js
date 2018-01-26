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
  globalIdField,
  connectionArgs,
  connectionFromArray,
  getOffsetWithDefault,
  connectionFromPromisedArray,
  connectionFromArraySlice,
  cursorToOffset,
} from 'graphql-relay';

import { registerType } from '../definitions/node.js';

import _ from 'lodash';
import validator from 'validator';

import mysql from '../../config/mysql.js';

import { isLoggedIn, isOwner } from '../helpers.js';
import { userType } from './userType.js';
import { memoryType, memoryConnection } from './memoryType.js';
import { tagType } from './tagType.js';

import { User } from '../models/User.js';
import { Memory } from '../models/Memory.js';

import { connectionFromArrayInterval } from '../definitions/connectionFromArrayInterval.js';
import { connectionFromArrayBasic } from '../definitions/connectionFromArrayBasic.js';

export const viewerType = registerType(new GraphQLObjectType({
  name: 'Viewer',
  fields: () => ({
    id: globalIdField(),
    me: {
      type: userType,
      resolve: (rootValue, args, context) => {
        if (isLoggedIn(context)) {
          return User.gen(context, context.user.user_id);
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
        limit: {
          type: GraphQLInt,
          defaultValue: 10,
        },
        offset: {
          type: GraphQLInt,
          defaultValue: 0,
        },
      },
      resolve: async (rootValue, args, context) => {
        // const offset = getOffsetWithDefault(args.after, -1) + 1;
        const array = await mysql.getMemoryIdsByUserId({
          user_id: context.user.user_id,
          limit: args.limit + 1,
          offset: args.offset,
        })
        .then(rows => rows.map(row => Memory.gen(context, row.id)));
        return connectionFromArrayBasic(array, args);
      },
    },
    // memoryCount: {
    //   type: GraphQLInt,
    //   resolve: (rootValue, args, context) => {
    //
    //   },
    // },
    // tagCount: {
    //   type: GraphQLInt,
    //   resolve: (rootValue, args, context) => {
    //
    //   },
    // },
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
          limit: args.first + 1,
        })
        .then(rows => rows.map(row => Memory.gen(context, row.id)));
        return connectionFromArray(array, args);
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
        const doesEmailExist = await mysql.doesEmailExist({
          email: args.email,
        })
        .then(value => value[0].doesEmailExist);
        if (args.email.length < 1) {
          return null;
        } else if (
          doesEmailExist ||
          args.email.length > 255 ||
          !validator.isEmail(args.email)
        ) {
          return false;
        }
        return true;
      },
    },
  }),
}));
