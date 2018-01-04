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
import { subscriptionType } from '../types/subscriptionType.js';
import { isOwner, isLoggedIn } from '../helpers.js';

const stripe = require('stripe')('sk_test_ZYOq3ukyy4vckadi7twhdL9f');

export const updateSubscriptionMutation = {
  type: subscriptionType,
  args: {
    action: {
      type: GraphQLString,
    },
  },
  resolve: async (request, args, context) => {
    if (isLoggedIn(context) && args.action) {
      const customer_id = await mysql.getCustomerIdByUserId({
        user_id: context.user.user_id,
      })
      .then(value => value[0].customer_id);
      const subscription_id = await stripe.customers.retrieve(customer_id)
      .then(value => _.get(value.subscriptions, 'data[0].id'));
      if (args.action === 'cancel') {
        // Cancel sub
        return stripe.subscriptions.del(subscription_id, {
          at_period_end: true,
        })
        .then(() => {
          return stripe.subscriptions.retrieve(subscription_id);
        })
        .catch((err) => {
          console.log(err);
          return 'ERR';
        });
      } else if ('activate' && subscription_id) {
        // Update the sub, when sub still exists
        return stripe.subscriptions.retrieve(subscription_id)
        .then((subscription) => {
          return subscription.items.data[0].id;
        })
        .then((item_id) => {
          return stripe.subscriptions.update(subscription_id, {
            items: [{
              id: item_id,
              plan: 'basic-monthly',
            }],
          });
        })
        .then(() => {
          return stripe.subscriptions.retrieve(subscription_id);
        });
      } else if ('activate' && !subscription_id) {
        // Create sub when no sub exists
        return stripe.subscriptions.create({
          customer: customer_id,
          items: [
            { plan: 'basic-monthly' },
          ],
        })
        .then(() => {
          return stripe.subscriptions.retrieve(subscription_id);
        });
      }
    }
    return 0;
  },
};
