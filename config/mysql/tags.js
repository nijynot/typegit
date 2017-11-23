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

exports.getTagIdsByMemoryId = ({ memory_id }) => {
  return new Promise((resolve, reject) => {
    let sql = `select
    mt.tag_id as id
    from memory_tags mt
    where mt.memory_id = ?;`;
    sql = mysql.format(sql, [memory_id]);

    connection.query(sql, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

exports.getTagIdsByUserId = ({ user_id }) => {
  return new Promise((resolve, reject) => {
    let sql = `select
    t.tag_id as id
    from tags t
    where t.user_id = ?;`;
    sql = mysql.format(sql, [user_id]);

    connection.query(sql, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};
