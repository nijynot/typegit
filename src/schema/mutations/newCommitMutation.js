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
import isValid from 'date-fns/is_valid';

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
    console.log(input.text);
    const { id } = fromGlobalId(input.repositoryId);
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
      // Open repository
      const repo = await git.bareOpen(id);

      // Create file and add to index
      // await fs.ensureFile(path.join('./public/repo', paddedDir, 'index.md'));
      // fs.writeFileSync(path.join('./public/repo', paddedDir, 'index.md'), input.text);
      // await git.add(repo, {
      //   fileNames: ['index.md'],
      // });
      const headCommit = await repo.getHeadCommit();
      const headTree = await headCommit.getTree();
      const objId = await git.hashObject(repo, {
        data: input.text,
        len: Buffer.from(input.text).length,
        type: 3,
      });
      const treeId = await git.updateIndex(repo, {
        source: headTree,
        filename: 'index.md',
        id: objId,
        filemode: 33188,
      });

      // Create author and committer
      const user = await User.gen(context, context.user.user_id);
      const actor = git.createGitActor(user.username, user.email);

      // Commit initial commit
      const headline = input.commitHeadline || 'Update index.md';
      const message = (input.commitBody && `${headline}\n\n${input.commitBody}`) || headline;
      // const oid = await git.commit(repo, {
      //   author: gitActor,
      //   committer: gitActor,
      //   message,
      // });
      const oid = await git.commitTree(repo, {
        updateRef: 'refs/heads/master',
        author: actor,
        committer: actor,
        message,
        tree: treeId,
        parents: [headCommit],
      });
      await mysql.clearHashtags({ repository_id: fromGlobalId(input.repositoryId).id });
      const hashtags = _.uniq(twitter.extractHashtags(twitter.htmlEscape(input.text)));
      await Promise.all([
        hashtags.map(hashtag => mysql.insertHashtag({
          hashtag,
          repository_id: fromGlobalId(input.repositoryId).id,
        })),
      ]);
      return Commit.gen(context, { repo, id: oid });
    }
    return null;
  },
};
