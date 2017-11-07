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

import mysql from '../../config/mysql.js';
import { isOwner, isLoggedIn } from '../helpers.js';

export const deleteMemoryMutation = {
  type: GraphQLInt,
  args: {
    id: {
      type: GraphQLID,
    },
  },
  resolve: (request, args, session) => {
    if (isLoggedIn(session)) {
      return mysql.getMemoryByIdAndUserId({
        id: args.id,
        user_id: session.user.user_id,
      })
      .then((res) => {
        const user_id = get(res, '[0].user_id');
        if (isOwner(user_id, session)) {
          return mysql.deleteMemory({
            id: args.id,
          })
          .then((value) => {
            console.log(value);
            return 1;
          });
        }
        return 0;
      });
    }
    return 0;
  },
};
