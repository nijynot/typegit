const mysql = require('mysql');
const connection = require('../connection.js');

exports.getMemoryByIdAndUserId = ({ id, user_id }) => {
  return new Promise((resolve, reject) => {
    let sql = `select
    m.memory_id as id,
    m.title,
    m.body,
    m.created,
    m.user_id
    from memories m
    where memory_id = ? and user_id = ?;`;
    sql = mysql.format(sql, [id, user_id]);

    connection.query(sql, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

exports.getMemories = ({ user_id }) => {
  return new Promise((resolve, reject) => {
    let sql = `select
    m.memory_id as id,
    m.title,
    m.body,
    m.created,
    m.user_id
    from memories m
    where user_id = ?;`;
    sql = mysql.format(sql, [user_id]);

    connection.query(sql, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};
