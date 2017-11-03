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

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    viewer: {
      type: viewerType,
      resolve: () => {
        return { id: 1 };
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: queryType,
  // mutation: mutationType,
});

module.exports = schema;
