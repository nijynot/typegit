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
import mysql from '../../config/mysql.js';

// import { userType } from './userType.js';

export const tagType = new GraphQLObjectType({
  name: 'Tag',
  fields: () => ({
    id: globalIdField(),
    label: {
      type: GraphQLString,
    },
    color: {
      type: GraphQLString,
    },
  }),
});
