const mysql = require('mysql');

module.exports = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'superhacker1',
  database: 'diary',
  timezone: 'utc',
  dateStrings: 'TIMESTAMP',
  multipleStatements: false,
  charset: 'utf8mb4_unicode_ci',
});
