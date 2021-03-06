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
} from 'graphql-relay';

import mysql from '../../config/mysql.js';
import { registerType } from '../definitions/node.js';

export const subscriptionType = registerType(new GraphQLObjectType({
  name: 'Subscription',
  fields: () => ({
    id: globalIdField(),
    amount: {
      type: GraphQLInt,
    },
    current_period_end: {
      type: GraphQLInt,
    },
    current_period_start: {
      type: GraphQLInt,
    },
    cancel_at_period_end: {
      type: GraphQLBoolean,
    },
  }),
}));

// export const invoiceConnection = connectionDefinitions({
//   name: 'InvoiceConnection',
//   type: invoiceType,
// });
