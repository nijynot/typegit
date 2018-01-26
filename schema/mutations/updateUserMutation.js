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

import validator from 'validator';

import mysql from '../../config/mysql.js';
import { userType } from '../types/userType.js';
import { isOwner, isLoggedIn } from '../helpers.js';

const stripe = require('stripe')('sk_test_ZYOq3ukyy4vckadi7twhdL9f');

export const updateUserMutation = {
  type: userType,
  args: {
    heading: {
      type: GraphQLString,
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve: async (request, args, context) => {
    const doesEmailExist = await mysql.doesEmailExist({
      email: args.email,
    })
    .then(value => value[0].doesEmailExist);
    const user = await mysql.getUserById({
      id: context.user.user_id,
    })
    .then(value => value[0]);
    const customerId = await mysql.getCustomerIdByUserId({
      user_id: context.user.user_id,
    })
    .then(value => value[0].customer_id);

    if (
      validator.isEmail(args.email) &&
      (doesEmailExist === 0 || user.email === args.email)
    ) {
      if (doesEmailExist === 0) {
        await stripe.customers.update(customerId, {
          email: args.email,
        });
      }
      await mysql.updateUser({
        user_id: context.user.user_id,
        heading: args.heading,
        email: args.email,
      });
      const res = await mysql.getUserById({
        id: context.user.user_id,
      })
      .then(value => value[0]);
      return res;
    }
    return null;
  },
};
