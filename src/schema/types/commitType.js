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
import * as git from '../git.js';
import { connectionFromArray } from '../definitions/connectionFromArray.js';
import {
  connectionFromHistory,
  historyCursorToOid,
} from '../definitions/connectionFromHistory.js';
import { registerType } from '../definitions/node.js';
import { transformToForward } from '../definitions/transformToForward.js';

import { Commit } from '../models/Commit.js';
import { Tree } from '../models/Tree.js';
import { gitActorType } from './gitActorType.js';
import { gitObjectType } from './gitObjectType.js';
import { repositoryType } from './repositoryType.js';
import { treeType } from './treeType.js';

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
      description: 'Commit history including this commit.',
      args: {
        ...connectionArgs,
      },
      type: commitConnection,
      resolve: async (rootValue, args, context) => {
        const { first, after } = transformToForward(args);
        const oid = historyCursorToOid(after);
        const commits = await git.history(rootValue.git.owner(), {
          count: first + 2,
          sha: oid || rootValue.sha,
        });
        const array = await Promise.all(commits.map((commit) => {
          return Commit.wrap(context, { repository: rootValue.git.owner(), commit });
        }));
        return connectionFromHistory(array, { first, after });
      },
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
    repository: {
      type: repositoryType,
    },
    tree: {
      type: treeType,
      resolve: async (rootValue, args, context) => {
        const tree = await rootValue.git.getTree();
        return Tree.gen(context, {
          repository: rootValue.git.owner(),
          id: tree.id().toString(),
        });
      },
    },
  }),
  interfaces: () => [gitObjectType],
}));

export const { connectionType: commitConnection } = connectionDefinitions({
  nodeType: commitType,
});
