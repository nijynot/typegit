const mysql = require('mysql');
const connection = require('../connection.js');

exports.getTagByIdAndUserId = ({ id, user_id }) => {
  return new Promise((resolve, reject) => {
    let sql = `select
    m.tag_id as id,
    m.label,
    m.color,
    m.user_id
    from memories m
    where tag_id = ? and user_id = ?;`;
    sql = mysql.format(sql, [id, user_id]);

    connection.query(sql, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

exports.getTagsByMemoryId = ({ memory_id }) => {
  return new Promise((resolve, reject) => {
    let sql = `select
    t.tag_id as id,
    t.label,
    t.color,
    t.user_id
    from memory_tags mt
    join tags t on mt.tag_id = t.tag_id
    where mt.memory_id = ?;`;
    sql = mysql.format(sql, [memory_id]);

    connection.query(sql, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};
