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

import { globalIdField } from 'graphql-base64';
import {
  connectionDefinitions,
  connectionArgs,
  connectionFromArray,
} from 'graphql-connection';
import mysql from '../../config/mysql.js';

import { isOwner } from '../helpers.js';
import { userType } from './userType.js';
import { tagType, tagConnection } from './tagType.js';

// import { Memory } from '../loaders/MemoryLoader.js';
import { User } from '../loaders/UserLoader.js';
import { Tag } from '../loaders/TagLoader.js';

export const memoryType = new GraphQLObjectType({
  name: 'Memory',
  fields: () => ({
    id: globalIdField(),
    title: {
      type: GraphQLString,
    },
    body: {
      type: GraphQLString,
    },
    created: {
      type: GraphQLString,
    },
    user: {
      type: userType,
      resolve: (rootValue, args, context) => {
        return User.gen(context, rootValue.user_id);
      },
    },
    tags: {
      type: new GraphQLList(tagType),
      resolve: async (rootValue, args, context) => {
        const array = await mysql.getTagsByMemoryId({
          memory_id: rootValue.id,
        });
        return array;
      },
    },
  }),
});

export const memoryConnection = connectionDefinitions({
  name: 'MemoryConnection',
  type: memoryType,
});
