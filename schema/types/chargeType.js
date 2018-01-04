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

export const chargeType = new GraphQLObjectType({
  name: 'Charge',
  fields: () => ({
    id: globalIdField(),
    amount: {
      type: GraphQLInt,
    },
    created: {
      type: GraphQLInt,
    },
    invoice: {
      type: GraphQLString,
    },
  }),
});

export const chargeConnection = connectionDefinitions({
  name: 'ChargeConnection',
  type: chargeType,
});
