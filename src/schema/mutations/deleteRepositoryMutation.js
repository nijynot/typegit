import {
  GraphQLID,
  GraphQLInt,
} from 'graphql';
import {
  fromGlobalId,
} from 'graphql-relay';
import nodegit from 'nodegit';
import _ from 'lodash';
import fs from 'fs-extra';
import moment from 'moment';
import path from 'path';
import isValid from 'date-fns/is_valid';
import rimraf from 'rimraf';

import twitter from '../../../vendor/twitter-text.js';
import mysql from '../../config/mysql.js';
import { STRIPE_SK } from '../../config/constants.js';
import { isLoggedIn } from '../helpers.js';
import * as git from '../git.js';

import { User } from '../models/User.js';
import { Repository } from '../models/Repository.js';
// import { commitType } from '../types/commitType.js';

const stripe = require('stripe')(STRIPE_SK);

export const deleteRepositoryMutation = {
  type: GraphQLInt,
  args: {
    id: {
      type: GraphQLID,
    },
  },
  resolve: async (request, args, context) => {
    const { id } = fromGlobalId(args.id);
    const customer_id = await mysql.getCustomerIdByUserId({
      user_id: _.get(context, 'user.user_id'),
    })
    .then(value => value[0].customer_id);
    const subscription = await stripe.subscriptions.list({
      customer: customer_id,
    })
    .catch(err => console.log(err));
    const repo = await Repository.gen(context, id);

    if (
      isLoggedIn(context) &&
      !_.isEmpty(_.get(subscription, 'data')) &&
      _.get(repo, 'user_id', 123) === _.get(context, 'user.user_id', null)
    ) {
      mysql.deleteRepository({
        id,
      });
      rimraf(repo.git.path(), (err) => {
        if (err) console.log(err);
      });
      return 1;
    }
    return 0;
  },
};
