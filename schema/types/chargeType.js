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
  connectionFromArray,
  connectionDefinitions,
} from 'graphql-relay';

import { registerType } from '../definitions/node.js';

import mysql from '../../config/mysql.js';

export const chargeType = registerType(new GraphQLObjectType({
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
}));

export const { connectionType: chargeConnection } = connectionDefinitions({
  nodeType: chargeType,
});
