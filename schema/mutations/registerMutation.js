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
import { isOwner, isLoggedIn } from '../helpers.js';

import { userType } from '../types/userType.js';

const stripe = require('stripe')('sk_test_ZYOq3ukyy4vckadi7twhdL9f');

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
  resolve: async (request, args) => {
    const { username, email, password } = args;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    if (
      validator.isAlphanumeric(username) &&
      validator.isEmail(email)
    ) {
      return mysql.register({
        username,
        email,
        password: hash,
      })
      .then(async (res) => {
        const id = res.insertId;
        return stripe.customers.create({
          email: args.email,
        })
        .then(() => {
          return id;
        });
      })
      .then(async (id) => {
        const user = await mysql.getUserById({ id })
        .then(value => value[0]);
        console.log(user);
        return user;
      });
    }
    return null;
  },
};
