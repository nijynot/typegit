const get = require('lodash/get');
const mysql = require('../config/mysql.js');
const _ = require('lodash');

exports.isLoggedIn = (session) => {
  if (get(session.user, 'user_id')) {
    return true;
  }
  return false;
};

function getUserId(session) {
  return _.get(session, 'user.user_id');
}
exports.getUserId = getUserId;

function isOwner(user_id, session) {
  if (user_id === getUserId(session)) {
    return true;
  }
  return false;
}
exports.isOwner = isOwner;
