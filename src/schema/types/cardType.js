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
  connectionDefinitions,
} from 'graphql-relay';

import { registerType } from '../definitions/node.js';

import mysql from '../../config/mysql.js';

export const cardType = registerType(new GraphQLObjectType({
  name: 'Card',
  fields: () => ({
    last4: {
      type: GraphQLString,
    },
    brand: {
      type: GraphQLString,
    },
  }),
}));

export const { connectionType: cardConnection } = connectionDefinitions({
  nodeType: cardType,
});
