-- create an author
insert into authors (id, name, handle) values
(gen_random_uuid(), 'Alice', 'alice')
on conflict do nothing;

-- create tag 科技
insert into tags (id, name) values
(gen_random_uuid(), '科技')
on conflict do nothing;

-- insert several articles
insert into articles (id, author_id, title, excerpt, content, like_count)
select gen_random_uuid(), a.id, concat('示範文章 ', i), concat('摘要 ', i), concat('內容 ', i), floor(random()*300)
from generate_series(1, 20) i, authors a
where a.handle = 'alice';
