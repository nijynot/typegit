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

import mysql from '../../config/mysql.js';
import { userType } from '../types/userType.js';
import { isOwner, isLoggedIn } from '../helpers.js';

export const updateUserMutation = {
  type: userType,
  args: {
    heading: {
      type: GraphQLString,
    },
  },
  resolve: async (request, args, context) => {
    // const { id } = fromGlobalId(args.id);
    if (isLoggedIn(context)) {
      await mysql.updateUser({
        user_id: context.user.user_id,
        heading: args.heading,
      });
      const user = await mysql.getUserById({
        id: context.user.user_id,
      })
      .then(value => value[0]);
      return user;
    }
    return null;
  },
};
