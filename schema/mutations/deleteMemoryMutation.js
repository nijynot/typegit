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
import {
  fromGlobalId,
} from 'graphql-relay';
import _ from 'lodash';

import mysql from '../../config/mysql.js';

import { Memory } from '../models/Memory.js';

const stripe = require('stripe')('sk_test_ZYOq3ukyy4vckadi7twhdL9f');

export const deleteMemoryMutation = {
  type: GraphQLInt,
  args: {
    id: {
      type: GraphQLID,
    },
  },
  resolve: async (request, args, context) => {
    const memoryId = fromGlobalId(args.id).id;
    const memory = await Memory.gen(context, memoryId);
    const customer_id = await mysql.getCustomerIdByUserId({
      user_id: _.get(context, 'user.user_id'),
    })
    .then(value => value[0].customer_id);
    const subscription = await stripe.subscriptions.list({
      customer: customer_id,
    })
    .catch(err => console.log(err));

    if (
      (parseInt(_.get(memory, 'user_id'), 10) ===
      parseInt(context.user.user_id, 10)) &&
      !_.isEmpty(_.get(subscription, 'data'))
    ) {
      await mysql.deleteMemory({
        id: memoryId,
      });
      return 1;
    }
    return 0;
  },
};
