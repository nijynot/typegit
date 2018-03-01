const mysql = require('mysql');
const connection = require('../connection.js');

exports.getImagesByIds = ({ ids }) => {
  return new Promise((resolve, reject) => {
    let sql = `select
    i.uuid as id,
    i.user_id,
    i.created
    from images i
    where i.uuid in (?)
    order by field(i.uuid, ?);`;
    sql = mysql.format(sql, [ids, ids]);

    connection.query(sql, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

exports.getImageIdsByUserId = ({ user_id, limit, offset }) => {
  return new Promise((resolve, reject) => {
    let sql = `select
    i.uuid as id,
    i.created
    from images i
    where i.user_id = ?
    order by i.created desc
    limit ? offset ?;`;
    sql = mysql.format(sql, [user_id, limit, offset]);

    connection.query(sql, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

exports.insertImage = ({ uuid, user_id }) => {
  return new Promise((resolve, reject) => {
    let sql = `insert into images (
      uuid, user_id
    ) values (
      ?, ?
    );`;
    sql = mysql.format(sql, [uuid, user_id]);

    connection.query(sql, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};
