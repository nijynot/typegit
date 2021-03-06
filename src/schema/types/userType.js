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
  fromGlobalId,
} from 'graphql-relay';
import _ from 'lodash';

import mysql from '../../config/mysql.js';
import { STRIPE_SK } from '../../config/constants.js';
import { connectionFromArray } from '../definitions/connectionFromArray.js';
import { transformToForward } from '../definitions/transformToForward.js';
import { registerType } from '../definitions/node.js';

import { Image } from '../models/Image.js';
import { Repository } from '../models/Repository.js';
import { User } from '../models/User.js';
import { cardType } from './cardType.js';
import { chargeConnection } from './chargeType.js';
import { imageConnection } from './imageType.js';
import { repositoryConnection } from './repositoryType.js';
import { subscriptionType } from './subscriptionType.js';
import { tagType } from './tagType.js';
import { upcomingInvoiceType } from './upcomingInvoiceType.js';

const stripe = require('stripe')(STRIPE_SK);

export const userType = registerType(new GraphQLObjectType({
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

          const cards = await stripe.customers.listCards(customer_id);
          if (!_.isEmpty(cards.data)) {
            return {
              last4: cards.data[0].last4,
              brand: cards.data[0].brand,
            };
          }
        }
        return {
          last4: null,
          brand: null,
        };
      },
    },
    charges: {
      type: chargeConnection,
      args: {
        ...connectionArgs,
        starting_after: {
          type: GraphQLString,
          defaultValue: '',
        },
      },
      resolve: async (rootValue, args, context) => {
        // const offset = getOffsetWithDefault(args.after, -1) + 1;
        const starting_after = fromGlobalId(args.starting_after).id;
        const customer_id = await mysql.getCustomerIdByUserId({
          user_id: context.user.user_id,
        })
        .then(value => value[0].customer_id);
        const options = {
          customer: customer_id,
          limit: args.first + 1,
        };
        if (args.starting_after) {
          options.starting_after = starting_after;
        }
        const charges = await stripe.charges.list(options)
        .then(value => value.data);
        return connectionFromArray(charges, args);
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
          .catch(err => console.log(err));
          if (_.isEmpty(subscription.data)) {
            return {
              id: null,
              amount: null,
              current_period_end: null,
              current_period_start: null,
              cancel_at_period_end: null,
            };
          }
          return subscription.data[0];
        }
        return {
          id: null,
          amount: null,
          current_period_end: null,
          current_period_start: null,
          cancel_at_period_end: null,
        };
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
            // return null;
          });
          if (upcomingInvoice === undefined) {
            return {
              amount_due: null,
              date: null,
              currency: null,
            };
          }
          return upcomingInvoice;
        }
        return {
          amount_due: null,
          date: null,
          currency: null,
        };
      },
    },
    images: {
      type: imageConnection,
      args: {
        ...connectionArgs,
      },
      resolve: async (rootValue, args, context) => {
        const { first, after } = transformToForward(args);
        const images = await User.images(context, { first, after }, rootValue.id);
        return connectionFromArray(images, { first, after });
      },
    },
    repositories: {
      type: repositoryConnection,
      args: {
        ...connectionArgs,
      },
      resolve: async (rootValue, args, context) => {
        const { first, after } = transformToForward(args);
        const array = await mysql.getRepositoriesByUserId({
          user_id: rootValue.id,
        })
        .then(rows => rows.map(row => Repository.gen(context, row.id)));
        return connectionFromArray(array, { first, after });
      },
    },
  }),
}));
