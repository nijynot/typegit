const mysql = require('mysql');
const connection = require('../connection.js');

exports.getHashtagsByHashtags = ({ tags }) => {
  return new Promise((resolve, reject) => {
    let sql = `select
    h.hashtag as id,
    h.tag,
    h.color,
    h.user_id
    from hashtags h
    where h.hashtag in (?)
    order by field(h.hashtag, ?);`;
    sql = mysql.format(sql, [tags, tags]);

    connection.query(sql, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

exports.getHashtagByUserIdAndHashtag = ({ user_id, hashtag }) => {
  return new Promise((resolve, reject) => {
    let sql = `select
    h.hashtag as id,
    h.hashtag
    from hashtags h
    join repositories r on r.repository_id = h.repository_id
    where r.user_id = ? and h.hashtag = ?;`;
    sql = mysql.format(sql, [user_id, hashtag]);

    connection.query(sql, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

exports.getHashtagsByUserId = ({ user_id }) => {
  return new Promise((resolve, reject) => {
    let sql = `select
    h.hashtag as id,
    h.hashtag
    from hashtags h
    join repositories r on r.repository_id = h.repository_id
    where r.user_id = ?
    group by h.hashtag;`;
    sql = mysql.format(sql, [user_id]);

    connection.query(sql, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

exports.insertHashtag = ({ hashtag, repository_id }) => {
  return new Promise((resolve, reject) => {
    let sql = `insert into hashtags (
      hashtag, repository_id
    ) values (?, ?);`;
    sql = mysql.format(sql, [hashtag, repository_id]);

    connection.query(sql, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

exports.clearHashtags = ({ repository_id }) => {
  return new Promise((resolve, reject) => {
    let sql = `delete from hashtags
    where repository_id = ?;`;
    sql = mysql.format(sql, [repository_id]);

    connection.query(sql, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};
