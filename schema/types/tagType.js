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

// import { userType } from './userType.js';

export const tagType = new GraphQLObjectType({
  name: 'Tag',
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    label: {
      type: GraphQLString,
    },
    color: {
      type: GraphQLString,
    },
  }),
});
