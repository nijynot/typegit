create table customers (
  user_id int(12) unsigned not null,
  customer_id varchar(255) not null,
  primary key (user_id),
  foreign key (user_id)
  references users(user_id)
    on update cascade
    on delete cascade
) engine=innodb;
