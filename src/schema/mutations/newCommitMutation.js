import {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInputObjectType,
} from 'graphql';
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

import { User } from '../models/User.js';
// import { Repository } from '../models/Repository.js';
import { Commit } from '../models/Commit.js';
// import { repositoryType } from '../types/repositoryType.js';
import { commitType } from '../types/commitType.js';

const stripe = require('stripe')(STRIPE_SK);

export const newCommitInput = new GraphQLInputObjectType({
  name: 'NewCommitInput',
  fields: () => ({
    repositoryId: {
      type: GraphQLString,
    },
    commitHeadline: {
      type: GraphQLString,
    },
    commitBody: {
      type: GraphQLString,
    },
    text: {
      type: GraphQLString,
    },
  }),
});

export const newCommitMutation = {
  type: commitType,
  args: {
    input: {
      type: newCommitInput,
    },
  },
  resolve: async (request, { input }, context) => {
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
      const paddedDir = git.padDir(input.repositoryId);

      // Open repository
      const repo = await git.open(input.repositoryId);

      // Create file and add to index
      await fs.ensureFile(path.join('./public/repo', paddedDir, 'index.md'));
      fs.writeFileSync(path.join('./public/repo', paddedDir, 'index.md'), input.text);
      await git.add(repo, {
        fileNames: ['index.md'],
      });

      // Create author and commiter
      const user = await User.gen(context, context.user.user_id);
      const gitActor = git.createGitActor(user.username, user.email);

      // Commit initial commit
      const headline = input.commitHeadline || 'Update index.md';
      const message = (input.commitBody && `${headline}\n\n${input.commitBody}`) || headline;
      const oid = await git.commit(repo, {
        author: gitActor,
        commiter: gitActor,
        message,
      });

      return Commit.gen(context, { repository: repo, id: oid });
    }
    return null;
  },
};
