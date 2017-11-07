import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} from 'graphql';

import { viewerType } from './types/viewerType.js';

// Mutations
import { newMemoryMutation } from './mutations/newMemoryMutation.js';
import { deleteMemoryMutation } from './mutations/deleteMemoryMutation.js';

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    viewer: {
      type: viewerType,
      resolve: () => {
        return { id: 'root' };
      },
    },
  }),
});

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    newMemory: newMemoryMutation,
    deleteMemory: deleteMemoryMutation,
  }),
});

const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});

module.exports = schema;
