import getMemoryLoader from './getMemoryLoader.js';
import getTagLoader from './getTagLoader.js';
import getUserLoader from './getUserLoader.js';
import getImageLoader from './getImageLoader.js';

module.exports = () => {
  return {
    Memory: getMemoryLoader(),
    Tag: getTagLoader(),
    User: getUserLoader(),
    Image: getImageLoader(),
  };
};
