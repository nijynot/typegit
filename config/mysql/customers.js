const mysql = require('mysql');
const connection = require('../connection.js');

exports.insertCustomer = ({ user_id, customer_id }) => {
  return new Promise((resolve, reject) => {
    let sql = `insert into customers (
      user_id, customer_id
    ) values (
      ?, ?
    );`;
    sql = mysql.format(sql, [user_id, customer_id]);

    connection.query(sql, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

exports.getCustomerIdByUserId = ({ user_id }) => {
  return new Promise((resolve, reject) => {
    let sql = `select
    c.user_id,
    c.customer_id
    from customers c
    where c.user_id = ?;`;
    sql = mysql.format(sql, [user_id]);

    connection.query(sql, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};
