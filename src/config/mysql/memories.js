const mysql = require('mysql');
const connection = require('../connection.js');

exports.getMemoryByIdAndUserId = ({ id, user_id }) => {
  return new Promise((resolve, reject) => {
    let sql = `select
    m.memory_id as id,
    m.title,
    m.body,
    m.created,
    m.custom_title,
    m.custom_created,
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

exports.getMemoriesByIds = ({ ids }) => {
  return new Promise((resolve, reject) => {
    let sql = `select
    m.memory_id as id,
    m.title,
    m.body,
    m.created,
    m.custom_title,
    m.custom_created,
    m.user_id
    from memories m
    where m.memory_id in (?)
    order by field(m.memory_id, ?);`;
    sql = mysql.format(sql, [ids, ids]);

    connection.query(sql, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

// exports.getMemories = ({ user_id, limit }) => {
//   return new Promise((resolve, reject) => {
//     let sql = `select
//     m.memory_id as id,
//     m.title,
//     m.body,
//     m.created,
//     m.user_id
//     from memories m
//     where user_id = ?
//     order by created desc
//     limit ?;`;
//     sql = mysql.format(sql, [user_id, limit]);
//
//     connection.query(sql, (err, results) => {
//       if (err) reject(err);
//       resolve(results);
//     });
//   });
// };

exports.getMemoryIdsByUserId = ({ user_id, limit, offset }) => {
  return new Promise((resolve, reject) => {
    let sql = `select
    m.memory_id as id
    from memories m
    where m.user_id = ?
    order by created desc
    limit ? offset ?;`;
    sql = mysql.format(sql, [user_id, limit, offset]);

    connection.query(sql, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

exports.insertMemory = ({ memory_id, title, body, created, user_id }) => {
  return new Promise((resolve, reject) => {
    const UTC_TIMESTAMP = mysql.raw('UTC_TIMESTAMP()');
    const datetime = created || UTC_TIMESTAMP;
    let sql = `insert into memories (
      memory_id, title, body, created, user_id
    ) values (
      ?, ?, ?, ?, ?
    );`;
    sql = mysql.format(sql, [memory_id, title, body, datetime, user_id]);

    connection.query(sql, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

exports.deleteMemory = ({ id }) => {
  return new Promise((resolve, reject) => {
    let sql = `delete from memories
    where memory_id = ?;`;
    sql = mysql.format(sql, [id]);

    connection.query(sql, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

exports.updateMemory = ({ id, title, body, created }) => {
  return new Promise((resolve, reject) => {
    let sql = `update memories
    set title = ?,
    body = ?,
    created = ?
    where memory_id = ?;`;
    sql = mysql.format(sql, [title, body, created, id]);

    connection.query(sql, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};
