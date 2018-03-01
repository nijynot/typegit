create table images (
  uuid char(36) not null unique,
  user_id int(12) unsigned not null,
  created datetime not null default now(),
  primary key (uuid),
  foreign key (user_id)
  references users(user_id)
    on update cascade
    on delete cascade
) engine=innodb;
