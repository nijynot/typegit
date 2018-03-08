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
  connectionArgs,
} from 'graphql-relay';

import mysql from '../../config/mysql.js';
import { registerType } from '../definitions/node.js';

// import { repositoryType } from './repositoryType.js';
import { User } from '../models/User.js';
import { userType } from './userType.js';

export const gitActorType = registerType(new GraphQLObjectType({
  name: 'GitActor',
  fields: () => ({
    date: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLString,
    },
    name: {
      type: GraphQLString,
    },
    user: {
      type: userType,
      resolve: async (rootValue, args, context) => {
        return User.gen(context, rootValue.user_id);
      },
    },
  }),
}));

export const { connectionType: gitActorConnection } = connectionDefinitions({
  nodeType: gitActorType,
});
