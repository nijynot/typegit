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
import _ from 'lodash';
import path from 'path';

import mysql from '../../config/mysql.js';
import { registerType } from '../definitions/node.js';

import { GitObject } from '../models/GitObject.js';
import { Repository } from '../models/Repository.js';
import { gitObjectType } from './gitObjectType.js';
import { repositoryType } from './repositoryType.js';

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
      resolve: async (rootValue, args, context) => {
        const repositoryId = path.parse(rootValue.tree.owner().workdir()).name;
        const repo = await Repository.gen(context, repositoryId);
        return GitObject.gen(context, {
          repository: repo.git,
          id: rootValue.oid,
        });
      },
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
