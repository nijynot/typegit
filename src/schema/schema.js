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
import { repositoryType } from './types/repositoryType.js';
import { gitObjectType } from './types/gitObjectType.js';
import { blobType } from './types/blobType.js';
import { commitType } from './types/commitType.js';
import { treeType } from './types/treeType.js';

// Mutations
import { updateUserMutation } from './mutations/updateUserMutation.js';
import { updatePasswordMutation } from './mutations/updatePasswordMutation.js';
import { updateCustomerMutation } from './mutations/updateCustomerMutation.js';
import { updateSubscriptionMutation } from './mutations/updateSubscriptionMutation.js';
import { updateAvatarMutation } from './mutations/updateAvatarMutation.js';
import { registerMutation } from './mutations/registerMutation.js';
import { newImageMutation } from './mutations/newImageMutation.js';
import { newRepositoryMutation } from './mutations/newRepositoryMutation.js';
import { newCommitMutation } from './mutations/newCommitMutation.js';
import { updateRepositoryMutation } from './mutations/updateRepositoryMutation.js';
import { deleteRepositoryMutation } from './mutations/deleteRepositoryMutation.js';

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    newImage: newImageMutation,
    newRepository: newRepositoryMutation,
    newCommit: newCommitMutation,
    updateUser: updateUserMutation,
    updatePassword: updatePasswordMutation,
    updateCustomer: updateCustomerMutation,
    updateSubscription: updateSubscriptionMutation,
    updateAvatar: updateAvatarMutation,
    updateRepository: updateRepositoryMutation,
    deleteRepository: deleteRepositoryMutation,
    register: registerMutation,
  }),
});

const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
  types: [
    repositoryType,
    gitObjectType,
    blobType,
    commitType,
    treeType,
  ],
});

module.exports = schema;
