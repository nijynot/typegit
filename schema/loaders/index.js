const assign = require('lodash/assign');

const UserLoader = require('./UserLoader.js');
const MemoryLoader = require('./MemoryLoader.js');

module.exports = assign({},
  { UserLoader },
  { MemoryLoader }
);
