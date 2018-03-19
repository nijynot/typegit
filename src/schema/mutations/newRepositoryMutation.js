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
      const randid = randexp(/[a-zA-Z0-9]{12}/);
      const paddedDir = git.padDir(randid);
      // Create Repository
      // const repo = await git.init(randid);
      /* bareInit */
      const repo = await git.bareInit(randid);

      // Create file and add to index
      // await fs.ensureFile(path.join('./public/repo', paddedDir, 'index.md'))
      // .catch(err => console.error(err));
      // fs.writeFileSync(path.join('./public/repo', paddedDir, 'index.md'), input.text);
      // await git.add(repo, {
      //   fileNames: ['index.md'],
      // });
      // hash-object
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

      // Create author and committer
      const user = await User.gen(context, context.user.user_id);
      const actor = git.createGitActor(user.username, user.email);

      // Commit initial commit
      // await git.initialCommit(repo, {
      //   author: gitActor,
      //   committer: gitActor,
      //   message,
      // });
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

      // Insert into MySQL DB
      await mysql.insertRepository({
        repository_id: randid,
        title: input.title,
        description: input.description,
        created: input.created,
        user_id: context.user.user_id,
        auto_title: input.auto_title || 1,
        auto_created: input.auto_created || 1,
      });
      return Repository.gen(context, randid);
    }
    return null;
  },
};
