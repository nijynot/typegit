const assign = require('lodash/assign');

const memories = require('./mysql/memories.js');
const tags = require('./mysql/tags.js');
const users = require('./mysql/users.js');

module.exports = assign({},
  memories,
  tags,
  users
);
