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

import mysql from '../../config/mysql.js';
import { STRIPE_SK } from '../../config/constants.js';
import { userType } from '../types/userType.js';
import { isOwner, isLoggedIn } from '../helpers.js';

import { User } from '../models/User.js';

const stripe = require('stripe')(STRIPE_SK);

export const updateSubscriptionMutation = {
  type: userType,
  args: {
    action: {
      type: GraphQLString,
    },
  },
  resolve: async (request, args, context) => {
    const customer_id = await mysql.getCustomerIdByUserId({
      user_id: context.user.user_id,
    })
    .then(value => value[0].customer_id);
    const subscription_id = await stripe.customers.retrieve(customer_id)
    .then(value => _.get(value.subscriptions, 'data[0].id'));
    console.log(subscription_id);
    // Cancel sub
    if (args.action === 'cancel') {
      await stripe.subscriptions.del(subscription_id, {
        at_period_end: true,
      })
      .catch((err) => {
        console.log(err);
        return 'ERR';
      });
      return User.gen(context, context.user.user_id);
    }
    // Update the sub, when sub still exists
    if ('activate' && subscription_id) {
      const item_id = await stripe.subscriptions.retrieve(subscription_id)
      .then((subscription) => {
        return subscription.items.data[0].id;
      });
      await stripe.subscriptions.update(subscription_id, {
        items: [{
          id: item_id,
          plan: 'basic-monthly',
        }],
      });
      return User.gen(context, context.user.user_id);
    }
    // Create sub when no sub exists
    if ('activate' && !subscription_id) {
      await stripe.subscriptions.create({
        customer: customer_id,
        items: [
          { plan: 'basic-monthly' },
        ],
      });
      return User.gen(context, context.user.user_id);
    }
    return 0;
  },
};
