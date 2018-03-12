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
import { registerType, nodeInterface } from '../definitions/node.js';
import * as git from '../git.js';

import { GitObject } from '../models/GitObject.js';
import { Ref } from '../models/Ref.js';
import { Repository } from '../models/Repository.js';
import { User } from '../models/User.js';
// import { Image } from '../models/Image.js';
import { gitObjectType } from './gitObjectType.js';
import { refType } from './refType.js';
// import { treeEntryType } from './treeEntryType.js';
import { userType } from './userType.js';

export const repositoryType = registerType(new GraphQLObjectType({
  name: 'Repository',
  fields: () => ({
    id: globalIdField(),
    title: {
      type: GraphQLString,
    },
    auto_title: {
      type: GraphQLInt,
    },
    description: {
      type: GraphQLString,
    },
    created: {
      type: GraphQLString,
    },
    auto_created: {
      type: GraphQLInt,
    },
    defaultBranchRef: {
      type: refType,
      description: 'The default reference for a repository.',
      resolve: async (rootValue, args, context) => {
        return Ref.defaultBranchRef(context, {
          repository: rootValue.git,
        });
        // return Ref.defaultBranchRef(context, {
        //   repository: rootValue.git,
        // });
      },
    },
    // diskUsage: {
    //   type: GraphQLInt,
    // },
    name: {
      type: GraphQLString,
      description: 'Name of the folder which the repository resides in.',
      resolve: (rootValue) => {
        return rootValue.id;
      },
    },
    object: {
      description: 'A Git object in a repository.',
      args: {
        oid: {
          type: GraphQLString,
        },
        expression: {
          description: 'Only supports basic expressions that are parsable by rev-parse, e.g. master:index.md.',
          type: GraphQLString,
        },
      },
      type: gitObjectType,
      resolve: async (rootValue, args, context) => {
        if (args.oid) {
          return GitObject.gen(context, {
            repository: rootValue.git,
            id: args.oid,
          });
        }
        return GitObject.expression(context, {
          repository: rootValue.git,
          expression: args.expression,
        });
      },
    },
    user: {
      type: userType,
      resolve: async (rootValue, args, context) => {
        return User.gen(context, rootValue.user_id);
      },
    },
    // ref: {
    //   description: 'A reference in a repository.',
    //   type: refType,
    // },
    // refs: {
    //   type: refConnection,
    // },
  }),
  interfaces: [nodeInterface],
}));

export const { connectionType: repositoryConnection } = connectionDefinitions({
  nodeType: repositoryType,
  connectionFields: () => ({
    totalCount: {
      type: GraphQLInt,
    },
  }),
});
