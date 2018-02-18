const mysql = require('mysql');
const { DATABASE } = require('./constants.js');

module.exports = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'superhacker1',
  database: DATABASE,
  timezone: 'utc',
  dateStrings: 'TIMESTAMP',
  multipleStatements: false,
  charset: 'utf8mb4_unicode_ci',
});
