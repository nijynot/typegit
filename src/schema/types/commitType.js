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
import _ from 'lodash';
import path from 'path';

import mysql from '../../config/mysql.js';
import * as git from '../git.js';
import { connectionFromArray } from '../definitions/connectionFromArray.js';
import { registerType } from '../definitions/node.js';
import { transformToForward } from '../definitions/transformToForward.js';
import {
  oidFromCursor,
  toCursor,
  toForwardCommitArgs,
  connectionFromCommits,
  isBackward,
} from '../definitions/connectionFromCommits.js';

import { Commit } from '../models/Commit.js';
import { Repository } from '../models/Repository.js';
import { Tree } from '../models/Tree.js';
import { User } from '../models/User.js';
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
      resolve: async (rootValue, args, context) => {
        const author = rootValue.git.author();
        const userId = await User.idByUsername(context, author.name());
        return {
          date: author.when(),
          name: author.name(),
          email: author.email(),
          user_id: userId,
        };
      },
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
    committer: {
      type: gitActorType,
      resolve: async (rootValue, args, context) => {
        const committer = rootValue.git.committer();
        const userId = await User.idByUsername(context, committer.name());
        return {
          date: committer.when(),
          name: committer.name(),
          email: committer.email(),
          user_id: userId,
        };
      },
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
        const repo = rootValue.git.owner();
        const { first, after } = await toForwardCommitArgs(repo, args);
        const oid = oidFromCursor(after);
        const commits = await git.history(rootValue.git.owner(), {
          count: first + 2,
          sha: oid || rootValue.oid,
        });
        const array = await Promise.all(commits.map((commit) => {
          return Commit.wrap(context, { repo: rootValue.git.owner(), commit });
        }));
        return connectionFromCommits(array, { first, after }, {
          backward: isBackward(args),
        });
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
      resolve: async (rootValue, args, context) => {
        const repositoryId = path.parse(rootValue.git.owner().path()).name;
        return Repository.gen(context, repositoryId);
      },
    },
    tree: {
      type: treeType,
      resolve: async (rootValue, args, context) => {
        const tree = await rootValue.git.getTree();
        return Tree.gen(context, {
          repo: rootValue.git.owner(),
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
