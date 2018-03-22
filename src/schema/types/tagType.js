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

import {
  globalIdField,
  connectionArgs,
  connectionDefinitions,
  getOffsetWithDefault,
} from 'graphql-relay';

import mysql from '../../config/mysql.js';
import { registerType } from '../definitions/node.js';
import { connectionFromArray } from '../definitions/connectionFromArray.js';
import { transformToForward } from '../definitions/transformToForward.js';
import { isOwner } from '../helpers.js';

import { Tag } from '../models/Tag.js';

export const tagType = registerType(new GraphQLObjectType({
  name: 'Tag',
  fields: () => ({
    id: globalIdField(),
    tag: {
      type: GraphQLString,
    },
    count: {
      type: GraphQLInt,
      resolve: async (rootValue, args, context) => {
        if (!rootValue.count) {
          return Tag.count(context, rootValue.id);
        }
        return rootValue.count;
      },
    },
  }),
}));

export const { connectionType: tagConnection } = connectionDefinitions({
  nodeType: tagType,
});
