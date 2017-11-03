create table memories (
  memory_id char(12) collate utf8mb4_bin not null,
  title varchar(255),
  body text,
  created datetime not null default now(),
  user_id int(12) unsigned not null,
  primary key (memory_id),
  foreign key (user_id)
  references users(user_id)
    on update cascade
    on delete cascade
) engine=innodb;

insert into memories (
  memory_id, user_id
) values (
  'aaaaaaaaaaaa', 1
);
insert into memories (
  memory_id, user_id
) values (
  'AAAAAAAAAAAA', 1
);
