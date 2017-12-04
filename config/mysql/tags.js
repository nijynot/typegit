const mysql = require('mysql');
const connection = require('../connection.js');

exports.getTagsByIds = ({ ids }) => {
  return new Promise((resolve, reject) => {
    let sql = `select
    t.tag_id as id,
    t.label,
    t.color,
    t.user_id
    from tags t
    where t.tag_id in (?)
    order by field(t.tag_id, ?);`;
    sql = mysql.format(sql, [ids, ids]);

    connection.query(sql, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

exports.getTagsByMemoryId = ({ memory_id }) => {
  return new Promise((resolve, reject) => {
    let sql = `select
    t.tag
    from tags t
    where t.memory_id = ?;`;
    sql = mysql.format(sql, [memory_id]);

    connection.query(sql, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

exports.getTagsByUserId = ({ user_id }) => {
  return new Promise((resolve, reject) => {
    let sql = `select
    t.tag
    from tags t
    where t.user_id = ?;`;
    sql = mysql.format(sql, [user_id]);

    connection.query(sql, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

exports.insertTag = ({ tag, memory_id }) => {
  return new Promise((resolve, reject) => {
    let sql = `insert into tags (
      tag, memory_id
    ) values (?, ?);`;
    sql = mysql.format(sql, [tag, memory_id]);

    connection.query(sql, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};
