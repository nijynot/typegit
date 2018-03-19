create table hashtags (
  hashtag varchar(255) not null,
  repository_id char(12) collate utf8mb4_bin not null,
  created datetime not null default now(),
  primary key (hashtag, repository_id),
  foreign key (repository_id)
  references repositories(repository_id)
    on update cascade
    on delete cascade
) engine=innodb;
