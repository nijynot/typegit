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
import { fromGlobalId } from 'graphql-base64';

import mysql from '../../config/mysql.js';
import { memoryType } from '../types/memoryType.js';
import { isOwner, isLoggedIn } from '../helpers.js';

export const updateMemoryMutation = {
  type: memoryType,
  args: {
    id: {
      type: GraphQLID,
    },
    title: {
      type: GraphQLString,
    },
    body: {
      type: GraphQLString,
    },
    created: {
      type: GraphQLString,
    },
    tags: {
      type: new GraphQLList(GraphQLString),
    },
  },
  resolve: (request, args, context) => {
    const { id } = fromGlobalId(args.id);
    if (isLoggedIn(context)) {
      return mysql.getMemoryByIdAndUserId({
        id,
        user_id: context.user.user_id,
      })
      .then((res) => {
        const user_id = get(res, '[0].user_id');
        if (isOwner(context, user_id)) {
          return mysql.updateMemory({
            id,
            title: args.title,
            body: args.body,
            created: args.created,
          })
          .then((value) => {
            console.log(value);
            return res[0];
          });
        }
        return null;
      });
    }
    return null;
  },
};
