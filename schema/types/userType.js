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

import get from 'lodash/get';
import mysql from '../../config/mysql.js';

export const userType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    username: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLString,
      resolve: (rootValue, _, session) => {
        if (get(session, 'user.user_id') === rootValue.id) {
          return rootValue.email;
        }
        return null;
      },
    },
  }),
});
