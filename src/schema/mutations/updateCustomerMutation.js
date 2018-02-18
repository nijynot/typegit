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
import { STRIPE_SK } from '../../config/constants.js';
import { userType } from '../types/userType.js';
import { isOwner, isLoggedIn } from '../helpers.js';

const stripe = require('stripe')(STRIPE_SK);

export const updateCustomerMutation = {
  type: userType,
  args: {
    token: {
      type: GraphQLString,
    },
  },
  resolve: async (request, args, context) => {
    if (isLoggedIn(context)) {
      const customer_id = await mysql.getCustomerIdByUserId({
        user_id: context.user.user_id,
      })
      .then(value => value[0].customer_id);
      await stripe.customers.update(customer_id, {
        source: args.token,
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
