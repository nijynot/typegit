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
import { treeEntryType } from './treeEntryType.js';
import { gitObjectType } from './gitObjectType.js';

export const treeType = registerType(new GraphQLObjectType({
  name: 'Tree',
  fields: () => ({
    id: globalIdField(),
    partialOid: {
      type: GraphQLString,
    },
    oid: {
      type: GraphQLString,
    },
    entries: {
      type: new GraphQLList(treeEntryType),
    },
  }),
  interfaces: () => [gitObjectType],
}));

export const { connectionType: treeConnection } = connectionDefinitions({
  nodeType: treeType,
});
