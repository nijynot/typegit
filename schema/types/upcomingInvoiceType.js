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

import { globalIdField } from 'graphql-base64';
import {
  connectionDefinitions,
  connectionArgs,
  connectionFromArray,
} from 'graphql-connection';
import mysql from '../../config/mysql.js';

export const upcomingInvoiceType = new GraphQLObjectType({
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
});

// export const invoiceConnection = connectionDefinitions({
//   name: 'InvoiceConnection',
//   type: upcomingInvoiceType,
// });
