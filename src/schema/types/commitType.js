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

import { gitActorType } from './gitActorType.js';
import { gitObjectType } from './gitObjectType.js';
import { repositoryType } from './repositoryType.js';

export const commitType = registerType(new GraphQLObjectType({
  name: 'Commit',
  fields: () => ({
    id: globalIdField(),
    partialOid: {
      type: GraphQLString,
    },
    oid: {
      type: GraphQLString,
    },
    author: {
      type: gitActorType,
    },
    additions: {
      type: GraphQLInt,
    },
    changedFiles: {
      type: GraphQLInt,
    },
    commitedDate: {
      type: GraphQLString,
    },
    commiter: {
      type: gitActorType,
    },
    deletions: {
      type: GraphQLInt,
    },
    history: {
      args: {
        ...connectionArgs,
      },
      type: commitConnection,
    },
    message: {
      type: GraphQLString,
    },
    messageBody: {
      type: GraphQLString,
    },
    messageHeadline: {
      type: GraphQLString,
    },
    oid: {
      type: GraphQLString,
    },
    repository: {
      type: repositoryType,
    },
  }),
  interfaces: () => [gitObjectType],
}));

export const { connectionType: commitConnection } = connectionDefinitions({
  nodeType: commitType,
});
