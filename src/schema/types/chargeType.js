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
  connectionDefinitions,
} from 'graphql-relay';

import mysql from '../../config/mysql.js';
import { registerType } from '../definitions/node.js';

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
