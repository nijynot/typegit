const mysql = require('mysql');
const connection = require('../connection.js');

exports.getAverageCharactersPerMemory = ({ user_id }) => {
  return new Promise((resolve, reject) => {
    let sql = `select
    floor(avg(char_LENGTH(m.body) + char_length(m.title))) as average
    from memories m
    where m.user_id = ?;`;
    sql = mysql.format(sql, [user_id]);

    connection.query(sql, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

exports.getTotalCharacters = ({ user_id }) => {
  return new Promise((resolve, reject) => {
    let sql = `select
    sum(char_LENGTH(m.body) + char_length(m.title)) as total
    from memories m
    where m.user_id = ?;`;
    sql = mysql.format(sql, [user_id]);

    connection.query(sql, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

exports.getMostUsedTags = ({ user_id }) => {
  return new Promise((resolve, reject) => {
    let sql = `select
    t.tag as id,
    t.tag,
    count(*) as count
    from tags t
    join memories m on t.memory_id = m.memory_id
    where m.user_id = ?
    group by t.tag
    order by count desc
    limit 10;`;
    sql = mysql.format(sql, [user_id]);

    connection.query(sql, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};
//

exports.getTotalTags = ({ user_id }) => {
  return new Promise((resolve, reject) => {
    let sql = `select
    count(*) as total
    from tags t
    join memories m on t.memory_id = m.memory_id
    where m.user_id = ?;`;
    sql = mysql.format(sql, [user_id]);

    connection.query(sql, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};
