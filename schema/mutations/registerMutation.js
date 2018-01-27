import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import { fromGlobalId } from 'graphql-base64';
import get from 'lodash/get';
import validator from 'validator';
import bcrypt from 'bcryptjs';

import mysql from '../../config/mysql.js';
import { STRIPE_SK } from '../../config/constants.js';
import { isOwner, isLoggedIn } from '../helpers.js';

import { userType } from '../types/userType.js';

const stripe = require('stripe')(STRIPE_SK);

const passport = require('passport');
require('../../config/authentication/passport.js');

export const registerMutation = {
  type: userType,
  args: {
    username: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLString,
    },
    password: {
      type: GraphQLString,
    },
  },
  resolve: async (rootValue, args) => {
    const { req } = rootValue;
    const { username, email, password } = args;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const doesEmailExist = await mysql.doesEmailExist({
      email: args.email,
    })
    .then(value => value[0].doesEmailExist);
    if (
      validator.isAlphanumeric(username) &&
      validator.isEmail(email) &&
      doesEmailExist === 0
    ) {
      const register = await mysql.register({
        username,
        email,
        password: hash,
      });
      const customer = await stripe.customers.create({
        email: args.email,
        metadata: {
          user_id: register.insertId,
          username,
        },
      });
      await mysql.insertCustomer({
        user_id: register.insertId,
        customer_id: customer.id,
      });
      const user = await mysql.getUserById({
        id: register.insertId,
      })
      .then(value => value[0]);
      req.login(user, (err) => {
        if (err) console.log(err);
      });
      return user;
    }
    return null;
  },
};
