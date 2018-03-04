create table tags (
  tag varchar(255) not null,
  memory_id char(12) collate utf8mb4_bin not null,
  created datetime not null default now(),
  primary key (tag, memory_id),
  foreign key (memory_id)
  references memories(memory_id)
    on update cascade
    on delete cascade
) engine=innodb;
