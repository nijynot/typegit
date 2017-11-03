create table tags (
  tag_id int(12) unsigned not null auto_increment,
  label varchar(39) not null,
  color char(6) not null,
  user_id int(12) unsigned not null,
  primary key (tag_id),
  foreign key (user_id)
  references users(user_id)
    on update cascade
    on delete cascade
) engine=innodb;
