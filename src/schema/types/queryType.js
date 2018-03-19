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
  getOffsetWithDefault,
} from 'graphql-relay';
import validator from 'validator';

import mysql from '../../config/mysql.js';
import { registerType, nodeField } from '../definitions/node.js';
import { connectionFromArray } from '../definitions/connectionFromArray.js';
import { transformToForward } from '../definitions/transformToForward.js';
import { isLoggedIn } from '../helpers.js';

import { Repository } from '../models/Repository.js';
import { User } from '../models/User.js';
import { repositoryType, repositoryConnection } from './repositoryType.js';
import { hashtagType } from './hashtagType.js';
import { userType } from './userType.js';

export const queryType = registerType(new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    id: globalIdField(),
    // node: nodeField,
    me: {
      type: userType,
      resolve: (rootValue, args, context) => {
        if (isLoggedIn(context)) {
          return User.gen(context, context.user.user_id);
        }
        return null;
      },
    },
    repository: {
      type: repositoryType,
      args: {
        id: {
          type: GraphQLString,
        },
      },
      resolve: async (rootValue, args, context) => {
        return Repository.gen(context, args.id);
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
        const array = await mysql.getRepositoriesByUserId({
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
    hashtag: {
      type: hashtagType,
      args: {
        hashtag: {
          type: GraphQLString,
        },
      },
      resolve: async (rootValue, args, context) => {
        return mysql.getHashtagByUserIdAndHashtag({
          user_id: context.user.user_id,
          hashtag: args.hashtag,
        })
        .then(value => value[0]);
      },
    },
    hashtags: {
      type: new GraphQLList(hashtagType),
      resolve: async (rootValue, args, context) => {
        return mysql.getHashtagsByUserId({
          user_id: context.user.user_id,
        });
      },
    },
    // search: {
    //   type: repositoryConnection,
    //   args: {
    //     query: {
    //       type: GraphQLString,
    //     },
    //     ...connectionArgs,
    //   },
    //   resolve: async (rootValue, args, context) => {
    //     const array = await mysql.searchMemories({
    //       user_id: context.user.user_id,
    //       query: args.query,
    //       limit: args.first + 1,
    //     })
    //     .then(rows => rows.map(row => Memory.gen(context, row.id)));
    //     return connectionFromArray(array, args);
    //   },
    // },
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
