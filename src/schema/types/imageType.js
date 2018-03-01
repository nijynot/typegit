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

import { registerType } from '../definitions/node.js';

import mysql from '../../config/mysql.js';

import { userType } from './userType.js';

import { User } from '../models/User.js';
import { Image } from '../models/Image.js';

export const imageType = registerType(new GraphQLObjectType({
  name: 'Image',
  fields: () => ({
    id: globalIdField(),
    url: {
      type: GraphQLString,
      resolve: (rootValue, args, context) => {
        return Image.url(context, rootValue.id);
      },
    },
    user: {
      type: userType,
      resolve: async (rootValue, args, context) => {
        return User.gen(context, rootValue.user_id);
      },
    },
    created: {
      type: GraphQLString,
    },
  }),
}));

export const { connectionType: imageConnection, edgeType: imageEdge } = connectionDefinitions({
  nodeType: imageType,
});
