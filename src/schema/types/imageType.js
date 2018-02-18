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

export const imageType = registerType(new GraphQLObjectType({
  name: 'Image',
  fields: () => ({
    id: globalIdField(),
    user: {
      type: userType,
      resolve: async (rootValue, args, context) => {
        return User.gen(context, rootValue.user_id);
      },
    },
  }),
}));

export const { connectionType: imageConnection } = connectionDefinitions({
  nodeType: imageType,
});
