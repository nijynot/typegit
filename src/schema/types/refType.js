import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLInterfaceType,
  GraphQLString,
} from 'graphql';
import {
  globalIdField,
  connectionDefinitions,
} from 'graphql-relay';

import mysql from '../../config/mysql.js';
import { registerType } from '../definitions/node.js';

// import { User } from '../models/User.js';
// import { Image } from '../models/Image.js';
import { repositoryType } from './repositoryType.js';
import { gitObjectType } from './gitObjectType.js';

export const refType = registerType(new GraphQLInterfaceType({
  name: 'Ref',
  fields: () => ({
    id: globalIdField(),
    partialOid: {
      type: GraphQLString,
    },
    name: {
      type: GraphQLString,
    },
    prefix: {
      type: GraphQLString,
    },
    repository: {
      type: repositoryType,
    },
    target: {
      type: gitObjectType,
    },
  }),
}));

export const { connectionType: refConnection } = connectionDefinitions({
  nodeType: refType,
});
