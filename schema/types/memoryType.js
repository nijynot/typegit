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

import { tagType } from './tagType.js';

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
