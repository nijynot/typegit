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

import mysql from '../../config/mysql.js';
import { STRIPE_SK } from '../../config/constants.js';

import { User } from '../models/User.js';

import { memoryType } from '../types/memoryType.js';
import { repositoryType } from '../types/repositoryType.js';
import { isLoggedIn } from '../helpers.js';
import twitter from '../../../vendor/twitter-text.js';

const stripe = require('stripe')(STRIPE_SK);

export const newRepositoryInput = new GraphQLInputObjectType({
  name: 'NewRepositoryInput',
  fields: () => ({
    commitMessage: {
      type: GraphQLString,
    },
    commitDescription: {
      type: GraphQLString,
    },
    title: {
      type: GraphQLString,
    },
    body: {
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

      // Create Repository
      const first = randid.substr(0, 2);
      const second = randid.substr(2, 2);
      const third = randid.substr(4, 2);
      const repo = await git.Repository.init(`./public/repo/${first}/${second}/${third}/${randid}`, 0);

      // Create file and add to index
      await fs.writeFile(`./public/repo/${randid}/body.txt`, input.body)
      .then((res) => {
        console.log(res);
      });
      const index = await repo.refreshIndex();
      await index.addByPath('body.txt')
      .then((res) => {
        console.log(res);
      });
      await index.write();
      const oid = await index.writeTree();

      // Commit initial commit
      // const head = await git.Reference.nameToId(repo, 'HEAD');
      // const parent = await repo.getCommit(head);
      const user = User.gen(context, context.user.user_id);
      const author = git.Signature.create(user.username, user.email, moment().unix(), 0);
      const commiter = git.Signature.create(user.username, user.email, moment().unix(), 0);
      await repo.createCommit('HEAD', author, commiter, 'Initial commit', oid, []);

      // (async () => {
      //   // Commit
      //   const head = await git.Reference.nameToId(repo, 'HEAD');
      //   const parent = await repo.getCommit(head);
      //   const author = git.Signature.create('Tony Jin', 'nijynot@gmail', moment().unix(), 0);
      //   const commiter = git.Signature.create('Tony Jin', 'nijynot@gmail', moment().unix(), 0);
      //   await repo.createCommit('HEAD', author, commiter, 'Second commit', oid, [parent]);
      // })();

      // await mysql.insertMemory({
      //   memory_id: randid,
      //   title: input.title,
      //   body: input.body,
      //   created: input.created,
      //   user_id: context.user.user_id,
      // });
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
