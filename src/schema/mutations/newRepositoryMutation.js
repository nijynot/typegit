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
      const randid = randexp(/[a-zA-Z0-9]{12}/);
      const paddedDir = git.padDir(randid);
      // Create Repository
      const repo = await git.init(randid);

      // Create file and add to index
      console.log(path.join('./public/repo', paddedDir, 'index.md'));
      await fs.ensureFile(path.join('./public/repo', paddedDir, 'index.md'))
      .catch(err => console.error(err));
      fs.writeFileSync(path.join('./public/repo', paddedDir, 'index.md'), input.text);
      await git.add(repo, {
        fileNames: ['index.md'],
      });

      // Create author and commiter
      const user = await User.gen(context, context.user.user_id);
      const gitActor = git.createGitActor(user.username, user.email);

      // Commit initial commit
      const headline = input.commitHeadline || 'Initial commit';
      const message = (input.commitBody && `${headline}\n\n${input.commitBody}`) || headline;
      await git.initialCommit(repo, {
        author: gitActor,
        commiter: gitActor,
        message,
      });

      // Insert into MySQL DB
      await mysql.insertRepository({
        repository_id: randid,
        title: input.title,
        description: input.description,
        created: input.created,
        user_id: context.user.user_id,
      });
      return Repository.gen(context, randid);
      // await repo.createCommit('HEAD', author, commiter, 'Initial commit', oid, []);
      // const head = await git.Reference.nameToId(repo, 'HEAD');
      // const parent = await repo.getCommit(head);

      // (async () => {
      //   // Commit
      //   const head = await git.Reference.nameToId(repo, 'HEAD');
      //   const parent = await repo.getCommit(head);
      //   const author = git.Signature.create('Tony Jin', 'nijynot@gmail', moment().unix(), 0);
      //   const commiter = git.Signature.create('Tony Jin', 'nijynot@gmail', moment().unix(), 0);
      //   await repo.createCommit('HEAD', author, commiter, 'Second commit', oid, [parent]);
      // })();

      // const hashtags = _.uniq(twitter.extractHashtags(twitter.htmlEscape(input.body)));
      // await Promise.all([
      //   hashtags.map(hashtag => mysql.insertTag({
      //     tag: hashtag,
      //     memory_id: randid,
      //   })),
      // ]);
      // const memory = await mysql.getMemoryByIdAndUserId({
      //   id: randid,
      //   user_id: context.user.user_id,
      // })
      // .then(value => value[0]);
      // return memory;
    }
    return null;
  },
};
