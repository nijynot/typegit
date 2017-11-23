const assign = require('lodash/assign');

const UserLoader = require('./UserLoader.js');
const MemoryLoader = require('./MemoryLoader.js');
const TagLoader = require('./TagLoader.js');

module.exports = assign({},
  { UserLoader },
  { MemoryLoader },
  { TagLoader }
);
