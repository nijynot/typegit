create table users (
  user_id int(12) unsigned not null auto_increment,
  username varchar(39) not null unique,
  heading varchar(120),
  password char(60) not null,
  email varchar(255),
  created datetime not null default now(),
  primary key (user_id)
) engine=innodb;

-- insert into users (username, password) values (
--   'asdf',
--   '$2a$10$uP.OUnvBYVImzDAMOojqKuO2lxObGFyMsz5eBe55hn5CVrFanaIwq'
-- );
-- insert into users (username, password) values (
--   'ton',
--   '$2a$10$uP.OUnvBYVImzDAMOojqKuO2lxObGFyMsz5eBe55hn5CVrFanaIwq'
-- );
