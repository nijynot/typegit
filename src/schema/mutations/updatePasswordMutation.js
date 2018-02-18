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
import bcrypt from 'bcryptjs';

import mysql from '../../config/mysql.js';
import { userType } from '../types/userType.js';
import { isOwner, isLoggedIn } from '../helpers.js';

export const updatePasswordMutation = {
  type: GraphQLInt,
  args: {
    oldPassword: {
      type: GraphQLString,
    },
    newPassword: {
      type: GraphQLString,
    },
  },
  resolve: async (request, args, context) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(args.newPassword, salt);
    const user = await mysql.password({ user_id: context.user.user_id });
    if (
      bcrypt.compareSync(args.oldPassword, user[0].password) &&
      args.newPassword.length >= 7
    ) {
      await mysql.updatePassword({
        user_id: context.user.user_id,
        password: hash,
      });
      return 1;
    }
    return 0;
  },
};
