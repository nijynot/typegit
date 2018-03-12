create table repositories (
  repository_id char(12) collate utf8mb4_bin not null,
  title varchar(255),
  auto_title int(1) not null default 1,
  description text,
  created datetime not null default now(),
  auto_created int(1) not null default 1,
  user_id int(12) unsigned not null,
  -- FULLTEXT KEY `FULLTEXT_IND` (`title`,`body`),
  primary key (repository_id),
  foreign key (user_id)
  references users(user_id)
    on update cascade
    on delete cascade
) engine=innodb;

-- insert into repositories (
--   repository_id, title, description, user_id
-- ) values (
--   'Alice0000001', 'Thus Spoke Zarathustra', 'When Zarathustra was thirty years old, he left his home and the lake of his home, and went into the mountains. There he enjoyed his spirit and solitude, and for ten years did not weary of it. But at last his heart changed,--and rising one morning with the rosy dawn, he went before the sun, and spake thus unto it:\n\n Thou great star! What would be thy happiness if thou hadst not those for whom thou shinest!', 1
-- );
