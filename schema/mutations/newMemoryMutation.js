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

import { randexp } from 'randexp';

import mysql from '../../config/mysql.js';
import { memoryType } from '../types/memoryType.js';
import { isLoggedIn } from '../helpers.js';

export const newMemoryMutation = {
  type: memoryType,
  args: {
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
      type: new GraphQLList(GraphQLString),
    },
  },
  resolve: (request, args, session) => {
    if (isLoggedIn(session)) {
      const randid = randexp(/[a-zA-Z0-9]{12}/);
      return mysql.insertMemory({
        memory_id: randid,
        title: args.title,
        body: args.body,
        created: args.created,
        user_id: session.user.user_id,
      })
      .then(() => {
        return mysql.getMemoryByIdAndUserId({
          id: randid,
          user_id: session.user.user_id,
        })
        .then((value) => {
          return value[0];
        });
      });
    }
    return null;
  },
};
