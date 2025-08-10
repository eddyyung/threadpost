-- authors
create table if not exists authors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  handle text unique,
  bio text,
  created_at timestamptz default now()
);

-- tags
create table if not exists tags (
  id uuid primary key default gen_random_uuid(),
  name text unique not null
);

-- articles
create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references authors(id) on delete set null,
  title text,
  content text,
  excerpt text,
  like_count integer default 0,
  created_at timestamptz default now()
);

-- article_tags
create table if not exists article_tags (
  article_id uuid references articles(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (article_id, tag_id)
);

-- search logs (記錄用)
create table if not exists search_logs (
  id uuid primary key default gen_random_uuid(),
  user_id text,
  query_min_likes integer,
  query_tag text,
  result_count integer,
  created_at timestamptz default now()
);
