import getMemoryLoader from './getMemoryLoader.js';
import getTagLoader from './getTagLoader.js';
import getUserLoader from './getUserLoader.js';

module.exports = () => {
  return {
    Memory: getMemoryLoader(),
    Tag: getTagLoader(),
    User: getUserLoader(),
  };
};
