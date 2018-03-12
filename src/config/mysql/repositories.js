const mysql = require('mysql');
const connection = require('../connection.js');

exports.getRepositoriesByIds = ({ ids }) => {
  return new Promise((resolve, reject) => {
    let sql = `select
    r.repository_id as id,
    r.title,
    r.auto_title,
    r.description,
    r.created,
    r.auto_created,
    r.user_id
    from repositories r
    where r.repository_id in (?)
    order by field(r.repository_id, ?)`;
    sql = mysql.format(sql, [ids, ids]);

    connection.query(sql, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

exports.getRepositoriesByUserId = ({ user_id }) => {
  return new Promise((resolve, reject) => {
    let sql = `select
    r.repository_id as id
    from repositories r
    where r.user_id = ?
    order by created desc;`;
    sql = mysql.format(sql, [user_id]);

    connection.query(sql, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

exports.insertRepository = ({ repository_id, title, description, created, user_id }) => {
  return new Promise((resolve, reject) => {
    const UTC_TIMESTAMP = mysql.raw('UTC_TIMESTAMP()');
    const datetime = created || UTC_TIMESTAMP;
    let sql = `insert into repositories (
      repository_id, title, description, created, user_id
    ) values (
      ?, ?, ?, ?, ?
    );`;
    sql = mysql.format(sql, [repository_id, title, description, datetime, user_id]);

    connection.query(sql, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

exports.updateRepository = ({
  repository_id,
  title,
  auto_title,
  description,
  created,
  auto_created,
}) => {
  return new Promise((resolve, reject) => {
    let sql = `update repositories
    set title = ?,
    auto_title = ?,
    description = ?,
    created = ?,
    auto_created = ?
    where repository_id = ?
    limit 1;`;
    sql = mysql.format(sql, [
      title,
      auto_title,
      description,
      created,
      auto_created,
      repository_id,
    ]);

    connection.query(sql, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};
