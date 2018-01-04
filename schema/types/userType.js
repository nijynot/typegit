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

import _ from 'lodash';
import get from 'lodash/get';
import { globalIdField } from 'graphql-base64';
import {
  connectionArgs,
  connectionFromArray,
} from 'graphql-connection';

import mysql from '../../config/mysql.js';
import { isLoggedIn } from '../helpers.js';
import { tagType, tagConnection } from './tagType.js';
import { cardType } from './cardType.js';
import { chargeConnection } from './chargeType.js';
import { upcomingInvoiceType } from './upcomingInvoiceType.js';
import { subscriptionType } from './subscriptionType.js';

import { Tag } from '../loaders/TagLoader.js';

const stripe = require('stripe')('sk_test_ZYOq3ukyy4vckadi7twhdL9f');

export const userType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: globalIdField(),
    username: {
      type: GraphQLString,
    },
    heading: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLString,
      // resolve: (rootValue, _, session) => {
      //   if (get(session, 'user.user_id') === rootValue.id) {
      //     return rootValue.email;
      //   }
      //   return null;
      // },
    },
    tags: {
      type: new GraphQLList(tagType),
      resolve: async (rootValue, args, context) => {
        if (rootValue.id === context.user.user_id) {
          return mysql.getTagsByUserId({
            user_id: context.user.user_id,
          });
        }
        return null;
      },
    },
    averageCharactersPerMemory: {
      type: GraphQLInt,
      resolve: async (rootValue, args, context) => {
        const average = await mysql.getAverageCharactersPerMemory({
          user_id: context.user.user_id,
        })
        .then(value => value[0].average);
        return average;
      },
    },
    totalCharacters: {
      type: GraphQLInt,
      resolve: async (rootValue, args, context) => {
        const average = await mysql.getTotalCharacters({
          user_id: context.user.user_id,
        })
        .then(value => value[0].total);
        return average;
      },
    },
    mostUsedTags: {
      type: new GraphQLList(tagType),
      resolve: async (rootValue, args, context) => {
        const array = await mysql.getMostUsedTags({
          user_id: context.user.user_id,
        });
        return array;
      },
    },
    totalTags: {
      type: GraphQLInt,
      resolve: async (rootValue, args, context) => {
        const total = await mysql.getTotalTags({
          user_id: context.user.user_id,
        })
        .then(value => value[0].total);
        return total;
      },
    },
    customer_id: {
      type: GraphQLString,
      resolve: async (rootValue, args, context) => {
        if (rootValue.id === context.user.user_id) {
          const customerId = await mysql.getCustomerIdByUserId({
            user_id: context.user.user_id,
          })
          .then(value => value[0].customer_id);
          return customerId;
        }
        return null;
      },
    },
    card: {
      type: cardType,
      resolve: async (rootValue, args, context) => {
        if (rootValue.id === context.user.user_id) {
          const customer_id = await mysql.getCustomerIdByUserId({
            user_id: context.user.user_id,
          })
          .then(value => value[0].customer_id);

          const { last4, brand } = await stripe.customers.listCards(customer_id)
          .then(cards => cards.data[0]);
          return {
            last4,
            brand,
          };
        }
        return null;
      },
    },
    charges: {
      type: chargeConnection,
      args: {
        ...connectionArgs,
      },
      resolve: async (rootValue, args, context) => {
        if (isLoggedIn(context)) {
          const customer_id = await mysql.getCustomerIdByUserId({
            user_id: context.user.user_id,
          })
          .then(value => value[0].customer_id);
          const charges = await stripe.charges.list({
            customer: customer_id,
            limit: args.limit + 1,
          })
          .then(value => value.data);
          return connectionFromArray({ array: charges, args });
        }
        return null;
      },
    },
    subscription: {
      type: subscriptionType,
      resolve: async (rootValue, args, context) => {
        if (rootValue.id === context.user.user_id) {
          const customer_id = await mysql.getCustomerIdByUserId({
            user_id: context.user.user_id,
          })
          .then(value => value[0].customer_id);
          const subscription = await stripe.subscriptions.list({
            customer: customer_id,
          })
          .then(subscriptions => _.get(subscriptions, 'data[0]'));
          return subscription;
        }
        return null;
      },
    },
    // isSubscriptionActive: {
    //   type: GraphQLBoolean,
    //   resolve: async (rootValue, args, context) => {
    //     if (rootValue.id === context.user.user_id) {
    //       const customer_id = await mysql.getCustomerIdByUserId({
    //         user_id: context.user.user_id,
    //       })
    //       .then(value => value[0].customer_id);
    //       const subscriptions = await stripe.customers.retrieve(customer_id)
    //       .then(customer => customer.subscriptions.data[0]);
    //       if (!_.isEmpty(subscriptions)) {
    //         return true;
    //       }
    //       return false;
    //     }
    //     return null;
    //   },
    // },
    upcomingInvoice: {
      type: upcomingInvoiceType,
      resolve: async (rootValue, args, context) => {
        if (rootValue.id === context.user.user_id) {
          const customer_id = await mysql.getCustomerIdByUserId({
            user_id: context.user.user_id,
          })
          .then(value => value[0].customer_id);
          const upcomingInvoice = await stripe.invoices.retrieveUpcoming(customer_id)
          .catch((err) => {
            console.log(err);
            return null;
          });
          return upcomingInvoice;
        }
        return null;
      },
    },
  }),
});
