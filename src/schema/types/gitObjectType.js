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
import nodegit from 'nodegit';

import mysql from '../../config/mysql.js';
import { registerType, nodeInterface } from '../definitions/node.js';

import { Blob } from '../models/Blob.js';
import { Commit } from '../models/Commit.js';
import { Tree } from '../models/Tree.js';
import { blobType } from './blobType.js';
import { commitType } from './commitType.js';
import { repositoryType } from './repositoryType.js';
import { treeType } from './treeType.js';

export const gitObjectType = registerType(new GraphQLInterfaceType({
  name: 'GitObject',
  fields: () => ({
    id: globalIdField(),
    partialOid: {
      type: GraphQLString,
    },
    oid: {
      type: GraphQLString,
    },
    // repository: {
    //   type: repositoryType,
    // },
  }),
  resolveType: (value) => {
    if (value instanceof Commit) {
      return commitType;
    } else if (value instanceof Blob) {
      return blobType;
    } else if (value instanceof Tree) {
      return treeType;
    }
    return null;
  },
  interfaces: [nodeInterface],
}));

export const {
  connectionType: gitObjectConnection,
  edgeType: gitObjectEdge,
} = connectionDefinitions({
  nodeType: gitObjectType,
});
