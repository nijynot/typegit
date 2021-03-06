-- Users
insert into users (
  username, heading, password, email
) values (
  'alice', 'Alice\'s Journal', '$2a$10$9xIYIMfUyaVEp4EZ0DBHXeMm7HcrwAlcz62s4fyD7NxtcbAGJYPVi', 'alice@pilecrow.com'
);
insert into users (
  username, heading, password, email
) values (
  'bob', 'Bob\'s Journal', '$2a$10$9xIYIMfUyaVEp4EZ0DBHXeMm7HcrwAlcz62s4fyD7NxtcbAGJYPVi', 'bob@pilecrow.com'
);
insert into users (
  username, heading, password, email
) values (
  'chuck', 'Chuck\'s Cracking Journal', '$2a$10$9xIYIMfUyaVEp4EZ0DBHXeMm7HcrwAlcz62s4fyD7NxtcbAGJYPVi', 'chuck@pilecrow.com'
);


-- Memories
insert into memories (
  memory_id, title, body, created, user_id
) values (
  'Alice0000001',
  'Alice Private Entry: #1',
  'This should be secret and only visible to Alice. #secret',
  '2018-02-18 15:00:00',
  1
);
insert into memories (
  memory_id, title, body, created, user_id
) values (
  'Alice0000002',
  'Alice Private Entry: #2',
  'This should be secret and only visible to Alice. #private',
  '2018-02-18 16:00:00',
  1
);
insert into memories (
  memory_id, title, body, created, user_id
) values (
  'Bob000000001',
  'Bob Private Entry: #1',
  'This should be secret and only visible to Bob.',
  '2018-02-19 15:00:00',
  2
);
insert into memories (
  memory_id, title, body, created, user_id
) values (
  'Bob000000002',
  'Bob Private Entry: #2',
  'This should be secret and only visible to Bob.',
  '2018-02-19 16:00:00',
  2
);
insert into memories (
  memory_id, title, body, created, user_id
) values (
  'Chuck0000001',
  'Chuck Private Entry: #1',
  'This should be secret and only visible to Chuck.',
  '2018-02-20 15:00:00',
  3
);


-- Tags
insert into tags (
  tag, memory_id, created
) values (
  'secret', 'Alice0000001', '2018-02-18 15:00:00'
);
insert into tags (
  tag, memory_id, created
) values (
  'private', 'Alice0000002', '2018-02-18 16:00:00'
);

insert into customers (
  user_id, customer_id
) values (
  1, 'cus_CLaTtCdTEY2kfy'
);
insert into customers (
  user_id, customer_id
) values (
  2, 'cus_CLaTptVZQWY2oj'
);
insert into customers (
  user_id, customer_id
) values (
  3, 'cus_CLaTVtRrtLwr4s'
);

insert into images (
  uuid, user_id, created
) values (
  '8a84a76b-d895-45d1-82f2-614d7e1325cd', 1, '2018-02-19 12:00:00'
);
insert into images (
  uuid, user_id, created
) values (
  '3b5f28ea-cf80-4fd1-a111-80cce62dd814', 1, '2018-02-19 13:00:00'
);
insert into images (
  uuid, user_id, created
) values (
  '265c4d99-d287-4dd4-b5a8-cf1f9848498f', 1, '2018-02-19 14:00:00'
);
insert into images (
  uuid, user_id
) values (
  'dc617c3d-707d-45fe-9cc6-e1829eee2eed', 2
);
insert into images (
  uuid, user_id
) values (
  'a20011a4-cea5-4c5b-8cb6-32ace68e9648', 3
);
