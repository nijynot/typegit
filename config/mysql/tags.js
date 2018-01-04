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

exports.getTagByUserIdAndTag = ({ user_id, tag }) => {
  return new Promise((resolve, reject) => {
    let sql = `select
    t.tag as id,
    t.tag
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

exports.getTagsByMemoryId = ({ memory_id }) => {
  return new Promise((resolve, reject) => {
    let sql = `select
    t.tag as id,
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
    t.tag as id,
    t.tag
    from tags t
    join memories m on t.memory_id = m.memory_id
    where m.user_id = ?
    group by t.tag;`;
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

exports.getMemoryIdsByTagAndUserId = ({ tag, user_id, limit }) => {
  return new Promise((resolve, reject) => {
    let sql = `select
    m.memory_id as id
    from tags t
    join memories m on t.memory_id = m.memory_id
    where t.tag = ? and m.user_id = ?
    order by m.created desc
    limit ?;`;
    sql = mysql.format(sql, [tag, user_id, limit]);

    connection.query(sql, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};
