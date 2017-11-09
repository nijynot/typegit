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

import mysql from '../../config/mysql.js';

import { isOwner } from '../helpers.js';
import { userType } from './userType.js';
import { tagType } from './tagType.js';

// import { Memory } from '../loaders/MemoryLoader.js';
import { User } from '../loaders/UserLoader.js';

export const memoryType = new GraphQLObjectType({
  name: 'Memory',
  fields: () => ({
    id: {
      type: GraphQLID,
    },
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
      resolve: (rootValue) => {
        return mysql.getTagsByMemoryId({
          memory_id: rootValue.id,
        })
        .then((value) => {
          return value;
        });
      },
    },
  }),
});
