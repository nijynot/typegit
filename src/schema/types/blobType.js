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

// import { Image } from '../models/Image.js';
// import { User } from '../models/User.js';
import { gitObjectType } from './gitObjectType.js';
import { repositoryType } from './repositoryType.js';

export const blobType = registerType(new GraphQLObjectType({
  name: 'Blob',
  fields: () => ({
    id: globalIdField(),
    partialOid: {
      type: GraphQLString,
    },
    oid: {
      type: GraphQLString,
    },
    byteSize: {
      type: GraphQLInt,
    },
    isBinary: {
      type: GraphQLBoolean,
    },
    isTruncated: {
      type: GraphQLBoolean,
    },
    text: {
      type: GraphQLString,
    },
  }),
  interfaces: () => [gitObjectType],
}));

export const {
  connectionType: blobConnection,
} = connectionDefinitions({
  nodeType: blobType,
});
