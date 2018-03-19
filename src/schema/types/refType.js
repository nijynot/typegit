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
import path from 'path';
import _ from 'lodash';

import mysql from '../../config/mysql.js';
import { registerType } from '../definitions/node.js';

import { GitObject } from '../models/GitObject.js';
import { Repository } from '../models/Repository.js';
import { repositoryType } from './repositoryType.js';
import { gitObjectType } from './gitObjectType.js';

export const refType = registerType(new GraphQLObjectType({
  name: 'Ref',
  fields: () => ({
    id: globalIdField(),
    // partialOid: {
    //   type: GraphQLString,
    // },
    name: {
      type: GraphQLString,
    },
    shorthand: {
      type: GraphQLString,
    },
    repository: {
      type: repositoryType,
      resolve: async (rootValue, args, context) => {
        const repositoryId = path.parse(rootValue.git.owner().path()).name;
        return Repository.gen(context, repositoryId);
      },
    },
    target: {
      type: gitObjectType,
      resolve: async (rootValue, args, context) => {
        return GitObject.gen(context, {
          repo: rootValue.git.owner(),
          id: rootValue.git.target(),
        });
      },
    },
  }),
}));

export const { connectionType: refConnection } = connectionDefinitions({
  nodeType: refType,
});
