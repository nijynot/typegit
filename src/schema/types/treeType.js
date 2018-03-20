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
import path from 'path';
import _ from 'lodash';

import mysql from '../../config/mysql.js';
import { registerType } from '../definitions/node.js';

import { Repository } from '../models/Repository.js';
import { TreeEntry } from '../models/TreeEntry.js';
import { gitObjectType } from './gitObjectType.js';
import { repositoryType } from './repositoryType.js';
import { treeEntryType } from './treeEntryType.js';

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
    entry: {
      type: treeEntryType,
      args: {
        oid: {
          type: GraphQLString,
        },
        name: {
          type: GraphQLString,
        },
      },
      resolve: async (rootValue, args, context) => {
        if (args.oid) {
          return TreeEntry.gen(context, {
            tree: rootValue.git,
            id: args.oid,
          });
        } else if (args.name) {
          return TreeEntry.entryByName(context, {
            tree: rootValue.git,
            name: args.name,
          });
        }
      },
    },
    entries: {
      type: new GraphQLList(treeEntryType),
      resolve: async (rootValue, args, context) => {
        const entries = await rootValue.git.entries();
        const treeEntries = await Promise.all(entries.map(entry => TreeEntry.gen(context, {
          tree: rootValue.git,
          id: entry.id(),
        })));
        return treeEntries;
      },
    },
    repository: {
      type: repositoryType,
      resolve: async (rootValue, args, context) => {
        const repositoryId = path.parse(rootValue.git.owner().path()).name;
        return Repository.gen(context, repositoryId);
      },
    },
  }),
  interfaces: () => [gitObjectType],
}));

export const { connectionType: treeConnection } = connectionDefinitions({
  nodeType: treeType,
});
