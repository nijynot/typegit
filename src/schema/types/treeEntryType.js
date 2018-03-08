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

// import { User } from '../models/User.js';
// import { Image } from '../models/Image.js';
import { gitObjectType } from './gitObjectType.js';
import { repositoryType } from './repositoryType.js';
// import { treeEntryType } from './treeEntryType.js';


export const treeEntryType = registerType(new GraphQLObjectType({
  name: 'TreeEntry',
  fields: () => ({
    mode: {
      type: GraphQLInt,
    },
    name: {
      type: GraphQLString,
    },
    object: {
      type: gitObjectType,
    },
    oid: {
      type: GraphQLString,
    },
    repository: {
      type: repositoryType,
    },
    type: {
      type: GraphQLString,
    },
  }),
}));

export const { connectionType: treeEntryConnection } = connectionDefinitions({
  nodeType: treeEntryType,
});
