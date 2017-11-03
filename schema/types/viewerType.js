import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';


import mysql from '../../config/mysql.js';

import { memoryType } from './memoryType.js';
import { isOwner } from '../helpers.js';

export const viewerType = new GraphQLObjectType({
  name: 'Viewer',
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    memories: {
      type: new GraphQLList(memoryType),
      resolve: (rootValue, _, session) => {
        if (isOwner(rootValue.id, session)) {
          return mysql.getMemories({
            user_id: 1,
          })
          .then((value) => {
            return value;
          });
        }
        return [];
      },
    },
  }),
});
