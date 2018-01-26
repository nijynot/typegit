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
import get from 'lodash/get';
import { fromGlobalId } from 'graphql-base64';

import mysql from '../../config/mysql.js';
import twitter from '../../utils/twitter-text.js';
import { memoryType } from '../types/memoryType.js';

import { Memory } from '../models/Memory.js';

import { isOwner, isLoggedIn } from '../helpers.js';

const stripe = require('stripe')('sk_test_ZYOq3ukyy4vckadi7twhdL9f');

export const updateMemoryMutation = {
  type: memoryType,
  args: {
    id: {
      type: GraphQLID,
    },
    title: {
      type: GraphQLString,
    },
    body: {
      type: GraphQLString,
    },
    created: {
      type: GraphQLString,
    },
  },
  resolve: async (request, args, context) => {
    const memory_id = fromGlobalId(args.id).id;
    const customer_id = await mysql.getCustomerIdByUserId({
      user_id: _.get(context, 'user.user_id'),
    })
    .then(value => value[0].customer_id);
    const subscription = await stripe.subscriptions.list({
      customer: customer_id,
    })
    .catch(err => console.log(err));
    const memory = await Memory.gen(context, memory_id);

    // Check if sub
    if (
      isLoggedIn(context) &&
      !_.isEmpty(_.get(subscription, 'data')) &&
      parseInt(context.user.user_id, 10) ===
      parseInt(get(memory, 'user_id'), 10)
    ) {
      await mysql.updateMemory({
        id: memory_id,
        title: args.title,
        body: args.body,
        created: args.created,
      });
      await mysql.clearTags({ memory_id });
      const hashtags = _.uniq(twitter.extractHashtags(twitter.htmlEscape(args.body)));
      await Promise.all([
        hashtags.map(hashtag => mysql.insertTag({
          tag: hashtag,
          memory_id,
        })),
      ]);
      await Memory.clear(context, memory_id);
      return Memory.gen(context, memory_id);
    }
    return null;
  },
};
