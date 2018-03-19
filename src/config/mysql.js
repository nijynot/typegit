const assign = require('lodash/assign');

const tags = require('./mysql/tags.js');
const users = require('./mysql/users.js');
const insights = require('./mysql/insights.js');
const count = require('./mysql/count.js');
const search = require('./mysql/search.js');
const customers = require('./mysql/customers.js');
const images = require('./mysql/images.js');
const repositories = require('./mysql/repositories.js');
const hashtags = require('./mysql/hashtags.js');

module.exports = assign(
  {},
  tags,
  users,
  insights,
  count,
  search,
  customers,
  images,
  repositories,
  hashtags
);
