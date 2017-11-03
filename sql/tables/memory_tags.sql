create table memory_tags (
  memory_id char(12) collate utf8mb4_bin not null,
  tag_id int(12) unsigned not null,
  primary key (memory_id, tag_id),
  foreign key (memory_id)
  references memories(memory_id)
    on update cascade
    on delete cascade,
  foreign key (tag_id)
  references tags(tag_id)
    on update cascade
    on delete cascade
) engine=innodb;
