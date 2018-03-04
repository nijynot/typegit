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

// import { viewerType } from './types/viewerType.js';
import { queryType } from './types/queryType.js';

// Mutations
import { newMemoryMutation } from './mutations/newMemoryMutation.js';
import { deleteMemoryMutation } from './mutations/deleteMemoryMutation.js';
import { updateMemoryMutation } from './mutations/updateMemoryMutation.js';
import { updateUserMutation } from './mutations/updateUserMutation.js';
import { updatePasswordMutation } from './mutations/updatePasswordMutation.js';
import { updateCustomerMutation } from './mutations/updateCustomerMutation.js';
import { updateSubscriptionMutation } from './mutations/updateSubscriptionMutation.js';
import { updateAvatarMutation } from './mutations/updateAvatarMutation.js';
import { registerMutation } from './mutations/registerMutation.js';
import { newImageMutation } from './mutations/newImageMutation.js';

// const queryType = new GraphQLObjectType({
//   name: 'Query',
//   fields: () => ({
//     viewer: {
//       type: viewerType,
//       resolve: () => {
//         return { id: 'root' };
//       },
//     },
//   }),
// });

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    newMemory: newMemoryMutation,
    newImage: newImageMutation,
    deleteMemory: deleteMemoryMutation,
    updateMemory: updateMemoryMutation,
    updateUser: updateUserMutation,
    updatePassword: updatePasswordMutation,
    updateCustomer: updateCustomerMutation,
    updateSubscription: updateSubscriptionMutation,
    updateAvatar: updateAvatarMutation,
    register: registerMutation,
  }),
});

const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});

module.exports = schema;