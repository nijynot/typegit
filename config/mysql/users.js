const mysql = require('mysql');
const connection = require('../connection.js');

// authentication
// This is used by passport.js to authenticate, do not touch.
exports.user = (username) => {
  return new Promise((resolve, reject) => {
    let sql = `select
    u.username,
    u.user_id,
    u.password
    from users u
    where u.username = ?`;
    sql = mysql.format(sql, [username]);
    connection.query(sql, (err, results) => {
      if (err) console.log(err);
      resolve(results);
    });
  });
};

exports.getUserById = ({ id }) => {
  return new Promise((resolve, reject) => {
    let sql = `select
    u.user_id as id,
    u.username,
    u.email,
    u.created
    from users u
    where u.user_id = ?`;
    sql = mysql.format(sql, [id]);

    connection.query(sql, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

exports.getUserByUsername = ({ username }) => {
  return new Promise((resolve, reject) => {
    let sql = `select
    u.user_id as id,
    u.username,
    u.email,
    u.created
    from users u
    where u.username = ?`;
    sql = mysql.format(sql, [username]);

    connection.query(sql, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};
