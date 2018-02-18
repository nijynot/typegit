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
import { randexp } from 'randexp';

import mysql from '../../config/mysql.js';
import { STRIPE_SK } from '../../config/constants.js';

import { memoryType } from '../types/memoryType.js';
import { isLoggedIn } from '../helpers.js';
import twitter from '../../../vendor/twitter-text.js';

const stripe = require('stripe')(STRIPE_SK);

export const newMemoryMutation = {
  type: memoryType,
  args: {
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
  resolve: async (request, args, context) => {
    const customer_id = await mysql.getCustomerIdByUserId({
      user_id: _.get(context, 'user.user_id'),
    })
    .then(value => value[0].customer_id);
    const subscription = await stripe.subscriptions.list({
      customer: customer_id,
    })
    .catch(err => console.log(err));
    if (
      isLoggedIn(context) &&
      !_.isEmpty(_.get(subscription, 'data'))
    ) {
      const randid = randexp(/[a-zA-Z0-9]{12}/);
      return mysql.insertMemory({
        memory_id: randid,
        title: args.title,
        body: args.body,
        created: args.created,
        user_id: context.user.user_id,
      })
      .then(() => {
        const hashtags = _.uniq(twitter.extractHashtags(twitter.htmlEscape(args.body)));
        return Promise.all([
          hashtags.map(hashtag => mysql.insertTag({
            tag: hashtag,
            memory_id: randid,
          })),
        ]);
      })
      .then(() => {
        return mysql.getMemoryByIdAndUserId({
          id: randid,
          user_id: context.user.user_id,
        })
        .then(value => value[0]);
      });
    }
    return null;
  },
};
