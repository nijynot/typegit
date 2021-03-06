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
// import {
//   globalIdField,
//   connectionArgs,
//   connectionFromArray,
//   connectionDefinitions,
// } from 'graphql-relay';

import mysql from '../../config/mysql.js';
import { registerType } from '../definitions/node.js';

export const upcomingInvoiceType = registerType(new GraphQLObjectType({
  name: 'UpcomingInvoice',
  fields: () => ({
    amount_due: {
      type: GraphQLInt,
    },
    date: {
      type: GraphQLInt,
    },
    currency: {
      type: GraphQLString,
    },
  }),
}));

// export const invoiceConnection = connectionDefinitions({
//   name: 'InvoiceConnection',
//   type: upcomingInvoiceType,
// });
