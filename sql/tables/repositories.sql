create table repositories (
  repository_id char(12) collate utf8mb4_bin not null,
  created datetime not null default now(),
  user_id int(12) unsigned not null,
  -- FULLTEXT KEY `FULLTEXT_IND` (`title`,`body`),
  primary key (repository_id),
  foreign key (user_id)
  references users(user_id)
    on update cascade
    on delete cascade
) engine=innodb;

-- insert into repositories (
--   repository_id, user_id
-- ) values (
--   'Alice0000001', 1
-- );
