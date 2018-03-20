create table memories (
  memory_id char(12) collate utf8mb4_bin not null,
  title varchar(255),
  body text,
  created datetime not null default now(),
  custom_title int(1) not null default 0,
  custom_created int(1) not null default 0,
  user_id int(12) unsigned not null,
  FULLTEXT KEY `FULLTEXT_IND` (`title`,`body`),
  primary key (memory_id),
  foreign key (user_id)
  references users(user_id)
    on update cascade
    on delete cascade
) engine=innodb;
