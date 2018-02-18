const mysql = require('mysql');
const connection = require('../connection.js');

exports.getMemoryCount = ({ user_id }) => {
  return new Promise((resolve, reject) => {
    let sql = `select
    count(*) as count
    from memories m
    where m.user_id = ?;`;
    sql = mysql.format(sql, [user_id]);

    connection.query(sql, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

exports.getTagCount = ({ user_id }) => {
  return new Promise((resolve, reject) => {
    let sql = `select
    count(*) as count
    from tags t
    join memories m on t.memory_id = m.memory_id
    where m.user_id = ?;`;
    sql = mysql.format(sql, [user_id]);

    connection.query(sql, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

exports.getTagCountByTag = ({ user_id, tag }) => {
  return new Promise((resolve, reject) => {
    let sql = `select
    count(*) as count
    from tags t
    join memories m on t.memory_id = m.memory_id
    where m.user_id = ? and t.tag = ?;`;
    sql = mysql.format(sql, [user_id, tag]);

    connection.query(sql, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};
