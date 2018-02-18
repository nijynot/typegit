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
import {
  fromGlobalId,
} from 'graphql-relay';
import _ from 'lodash';

import mysql from '../../config/mysql.js';

import { imageType } from '../types/imageType.js';

export const deleteMemoryMutation = {
  type: imageType,
  args: {
  },
  resolve: async (request, args, context) => {
  },
};
