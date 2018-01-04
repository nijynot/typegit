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

import { isOwner } from '../helpers.js';

export const cardType = new GraphQLObjectType({
  name: 'Card',
  fields: () => ({
    last4: {
      type: GraphQLString,
    },
    brand: {
      type: GraphQLString,
    },
  }),
});

export const cardConnection = connectionDefinitions({
  name: 'CardConnection',
  type: cardType,
});
