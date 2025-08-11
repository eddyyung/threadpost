insert into authors (name, handle) values ('Alice', 'alice') on conflict do nothing;
insert into tags (name) values ('科技') on conflict do nothing;
