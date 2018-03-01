const redis = require('redis');
const client = redis.createClient();
client.select(4);

exports.client = client;

// exports.lrangeDesigner = ({ designer_id }) => {
//   return new Promise((resolve, reject) => {
//     client.lrange(designer_id, '0', '-1', (err, reply) => {
//       if (err) reject(err);
//       resolve(reply);
//     });
//   });
// };
