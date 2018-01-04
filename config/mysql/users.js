const mysql = require('mysql');
const connection = require('../connection.js');

// authentication
// This is used by passport.js to authenticate, do not touch.
exports.user = (username) => {
  return new Promise((resolve, reject) => {
    let sql = `select
    u.username,
    u.heading,
    u.user_id,
    u.password
    from users u
    where u.username = ?;`;
    sql = mysql.format(sql, [username]);
    connection.query(sql, (err, results) => {
      if (err) console.log(err);
      resolve(results);
    });
  });
};

exports.register = ({ username, email, password }) => {
  return new Promise((resolve, reject) => {
    let sql = `insert into users (
      username, email, password
    ) values (
      ?, ?, ?
    );`;
    sql = mysql.format(sql, [username, email, password]);
    connection.query(sql, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

exports.password = ({ user_id }) => {
  return new Promise((resolve, reject) => {
    let sql = `select
    u.user_id,
    u.password
    from users u
    where u.user_id = ?;`;
    sql = mysql.format(sql, [user_id]);
    connection.query(sql, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

exports.getUserById = ({ id }) => {
  return new Promise((resolve, reject) => {
    let sql = `select
    u.user_id as id,
    u.username,
    u.heading,
    u.email,
    u.created
    from users u
    where u.user_id = ?;`;
    sql = mysql.format(sql, [id]);

    connection.query(sql, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

exports.getUsersByIds = ({ ids }) => {
  return new Promise((resolve, reject) => {
    let sql = `select
    u.user_id as id,
    u.username,
    u.heading,
    u.email,
    u.created
    from users u
    where u.user_id in (?)
    order by field(u.user_id, ?);`;
    sql = mysql.format(sql, [ids, ids]);

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
    u.heading,
    u.email,
    u.created
    from users u
    where u.username = ?;`;
    sql = mysql.format(sql, [username]);

    connection.query(sql, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

exports.updateUser = ({ user_id, heading }) => {
  return new Promise((resolve, reject) => {
    let sql = `update users
    set heading = ?
    where user_id = ?
    limit 1;`;
    sql = mysql.format(sql, [heading, user_id]);

    connection.query(sql, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

exports.updatePassword = ({ user_id, password }) => {
  return new Promise((resolve, reject) => {
    let sql = `update users
    set password = ?
    where user_id = ?
    limit 1;`;
    sql = mysql.format(sql, [password, user_id]);

    connection.query(sql, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

exports.validateUsername = ({ username }) => {
  return new Promise((resolve, reject) => {
    let sql = `select exists(
      select
      1
      from users u
      where u.username = ?
    ) as validate;`;
    sql = mysql.format(sql, [username]);

    connection.query(sql, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

exports.validateEmail = ({ email }) => {
  return new Promise((resolve, reject) => {
    let sql = `select exists(
      select
      1
      from users u
      where u.email = ?
    ) as validate;`;
    sql = mysql.format(sql, [email]);

    connection.query(sql, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};
