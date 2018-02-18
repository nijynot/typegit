const mysql = require('mysql');
const connection = require('../connection.js');

exports.searchMemories = ({ user_id, query }) => {
  return new Promise((resolve, reject) => {
    let sql = `select
    m.memory_id as id
    from memories m
    where m.user_id = ?
    and match(title, body) against (? in natural language mode);`;
    sql = mysql.format(sql, [user_id, query]);

    connection.query(sql, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};
