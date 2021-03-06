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
import { randexp } from 'randexp';
import fs from 'fs-extra';
import moment from 'moment';
import path from 'path';

import twitter from '../../../vendor/twitter-text.js';
import mysql from '../../config/mysql.js';
import { STRIPE_SK } from '../../config/constants.js';
import { isLoggedIn } from '../helpers.js';
import * as git from '../git.js';

import { User } from '../models/User.js';
import { Repository } from '../models/Repository.js';
import { repositoryType } from '../types/repositoryType.js';

const stripe = require('stripe')(STRIPE_SK);

export const newRepositoryInput = new GraphQLInputObjectType({
  name: 'NewRepositoryInput',
  fields: () => ({
    commitHeadline: {
      type: GraphQLString,
    },
    commitBody: {
      type: GraphQLString,
    },
    title: {
      type: GraphQLString,
    },
    text: {
      type: GraphQLString,
    },
    created: {
      type: GraphQLString,
    },
    auto_title: {
      type: GraphQLInt,
    },
    auto_created: {
      type: GraphQLInt,
    },
  }),
});

export const newRepositoryMutation = {
  type: repositoryType,
  args: {
    input: {
      type: newRepositoryInput,
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
      /* Init bare repo */
      const randid = randexp(/[a-zA-Z0-9]{12}/);
      const repo = await git.bareInit(randid);

      /* Set-up config */
      const config = await repo.config();
      await config.setString('receive.maxInputSize', '10485960');

      /**
       * Create file and add to index
       * hash-object
       */
      // const headCommit = await repo.getHeadCommit();
      // const headTree = await headCommit.getTree();
      const objId = await git.hashObject(repo, {
        data: input.text,
        len: input.text.length,
        type: 3,
      });
      const treeId = await git.updateIndex(repo, {
        source: null,
        filename: 'index.md',
        id: objId,
        filemode: 33188,
      });

      /* Create author and committer */
      const user = await User.gen(context, context.user.user_id);
      const actor = git.createGitActor(user.username, user.email);

      /* Commit initial commit */
      const headline = input.commitHeadline || 'Initial commit';
      const message = (input.commitBody && `${headline}\n\n${input.commitBody}`) || headline;
      await git.commitTree(repo, {
        updateRef: 'refs/heads/master',
        author: actor,
        committer: actor,
        message,
        tree: treeId,
        parents: [],
      });

      /* Insert repo and metadata into MySQL */
      await mysql.insertRepository({
        repository_id: randid,
        title: input.title,
        description: input.description,
        created: input.created,
        user_id: context.user.user_id,
        auto_title: input.auto_title || 1,
        auto_created: input.auto_created || 1,
      });
      const hashtags = _.uniq(twitter.extractHashtags(twitter.htmlEscape(input.text)));
      await Promise.all([
        hashtags.map(hashtag => mysql.insertHashtag({
          hashtag,
          repository_id: randid,
        })),
      ]);
      return Repository.gen(context, randid);
    }
    return null;
  },
};
