import {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInputObjectType,
} from 'graphql';
import {
  fromGlobalId,
} from 'graphql-relay';
import nodegit from 'nodegit';
import _ from 'lodash';
import fs from 'fs-extra';
import moment from 'moment';
import path from 'path';

import twitter from '../../../vendor/twitter-text.js';
import mysql from '../../config/mysql.js';
import { STRIPE_SK } from '../../config/constants.js';
import { isLoggedIn } from '../helpers.js';
import * as git from '../git.js';

// import { User } from '../models/User.js';
import { Repository } from '../models/Repository.js';
import { repositoryType } from '../types/repositoryType.js';

const stripe = require('stripe')(STRIPE_SK);

export const updateRepositoryInput = new GraphQLInputObjectType({
  name: 'UpdateRepositoryInput',
  fields: () => ({
    id: {
      type: GraphQLString,
    },
    title: {
      type: GraphQLString,
    },
    auto_title: {
      type: GraphQLInt,
    },
    description: {
      type: GraphQLString,
    },
    created: {
      type: GraphQLString,
    },
    auto_created: {
      type: GraphQLInt,
    },
  }),
});

export const updateRepositoryMutation = {
  type: repositoryType,
  args: {
    input: {
      type: updateRepositoryInput,
    },
  },
  resolve: async (request, { input }, context) => {
    const { id } = fromGlobalId(input.id);
    const customer_id = await mysql.getCustomerIdByUserId({
      user_id: _.get(context, 'user.user_id'),
    })
    .then(value => value[0].customer_id);
    const subscription = await stripe.subscriptions.list({
      customer: customer_id,
    })
    .catch(err => console.log(err));

    if (
      isLoggedIn(context) &&
      !_.isEmpty(_.get(subscription, 'data'))
    ) {
      await mysql.updateRepository({
        repository_id: id,
        title: input.title,
        auto_title: input.auto_title,
        description: input.description,
        created: input.created,
        auto_created: input.auto_created,
      });
      return Repository.gen(context, id);
    }
    return null;
  },
};
