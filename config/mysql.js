const assign = require('lodash/assign');

const memories = require('./mysql/memories.js');
const tags = require('./mysql/tags.js');
const users = require('./mysql/users.js');
const insights = require('./mysql/insights.js');
const count = require('./mysql/count.js');
const search = require('./mysql/search.js');
const customers = require('./mysql/customers.js');

module.exports = assign({},
  memories,
  tags,
  users,
  insights,
  count,
  search,
  customers
);
