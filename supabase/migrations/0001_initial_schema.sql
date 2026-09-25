-- ==============================================================================
-- MIGRATION 0001: INITIAL SCHEMA BASELINE
-- ------------------------------------------------------------------------------
-- Baseline schema creating profiles, user_course_progress, user_bookmarks,
-- philosophical_reflections, waitlist_members, and auth trigger.
-- ==============================================================================

-- 1. PROFILES TABLE
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null check (
    char_length(email) between 3 and 255 
    and email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  ),
  full_name text check (
    char_length(full_name) between 1 and 100
  ),
  avatar_url text check (
    char_length(avatar_url) <= 1000
    and (avatar_url is null or avatar_url ~* '^https?://')
  ),
  favorite_tradition text check (
    char_length(favorite_tradition) <= 50
  ) default 'Rationalism',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.profiles force row level security;

drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using ( true );

drop policy if exists "Users can update only their own profile" on public.profiles;
create policy "Users can update only their own profile"
  on public.profiles for update
  using ( auth.uid() = id )
  with check ( auth.uid() = id );

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check ( auth.uid() = id );

-- 2. USER COURSE PROGRESS TABLE
create table if not exists public.user_course_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  course_id text not null check (
    char_length(course_id) between 1 and 50
    and course_id ~ '^[a-z0-9_-]+$'
  ),
  completed_modules text[] default array[]::text[] check (
    cardinality(completed_modules) <= 100
  ),
  progress_percent integer default 0 check (
    progress_percent between 0 and 100
  ),
  last_read_at timestamptz not null default now(),
  constraint unique_user_course unique (user_id, course_id)
);

alter table public.user_course_progress enable row level security;
alter table public.user_course_progress force row level security;

create index if not exists idx_user_progress_lookup 
  on public.user_course_progress (user_id, course_id);

drop policy if exists "Users can view own course progress" on public.user_course_progress;
create policy "Users can view own course progress"
  on public.user_course_progress for select
  using ( auth.uid() = user_id );

drop policy if exists "Users can insert own course progress" on public.user_course_progress;
create policy "Users can insert own course progress"
  on public.user_course_progress for insert
  with check ( auth.uid() = user_id );

drop policy if exists "Users can update own course progress" on public.user_course_progress;
create policy "Users can update own course progress"
  on public.user_course_progress for update
  using ( auth.uid() = user_id )
  with check ( auth.uid() = user_id );

drop policy if exists "Users can delete own course progress" on public.user_course_progress;
create policy "Users can delete own course progress"
  on public.user_course_progress for delete
  using ( auth.uid() = user_id );

-- 3. USER BOOKMARKS TABLE
create table if not exists public.user_bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  course_id text not null check (
    char_length(course_id) between 1 and 50
    and course_id ~ '^[a-z0-9_-]+$'
  ),
  quote_text text check (
    char_length(quote_text) <= 1000
  ),
  work_title text check (
    char_length(work_title) <= 200
  ),
  created_at timestamptz not null default now()
);

alter table public.user_bookmarks enable row level security;
alter table public.user_bookmarks force row level security;

create index if not exists idx_bookmarks_user_course 
  on public.user_bookmarks (user_id, course_id);

drop policy if exists "Users can read own bookmarks" on public.user_bookmarks;
create policy "Users can read own bookmarks"
  on public.user_bookmarks for select
  using ( auth.uid() = user_id );

drop policy if exists "Users can add own bookmarks" on public.user_bookmarks;
create policy "Users can add own bookmarks"
  on public.user_bookmarks for insert
  with check ( auth.uid() = user_id );

drop policy if exists "Users can delete own bookmarks" on public.user_bookmarks;
create policy "Users can delete own bookmarks"
  on public.user_bookmarks for delete
  using ( auth.uid() = user_id );

-- 4. PHILOSOPHICAL REFLECTIONS TABLE
create table if not exists public.philosophical_reflections (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  course_id text not null check (
    char_length(course_id) between 1 and 50
    and course_id ~ '^[a-z0-9_-]+$'
  ),
  reflection_text text not null check (
    char_length(reflection_text) between 1 and 5000
  ),
  is_private boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.philosophical_reflections enable row level security;
alter table public.philosophical_reflections force row level security;

create index if not exists idx_reflections_user 
  on public.philosophical_reflections (user_id, created_at desc);

drop policy if exists "Users can read own reflections" on public.philosophical_reflections;
create policy "Users can read own reflections"
  on public.philosophical_reflections for select
  using ( auth.uid() = user_id or is_private = false );

drop policy if exists "Users can write own reflections" on public.philosophical_reflections;
create policy "Users can write own reflections"
  on public.philosophical_reflections for insert
  with check ( auth.uid() = user_id );

drop policy if exists "Users can update own reflections" on public.philosophical_reflections;
create policy "Users can update own reflections"
  on public.philosophical_reflections for update
  using ( auth.uid() = user_id )
  with check ( auth.uid() = user_id );

drop policy if exists "Users can delete own reflections" on public.philosophical_reflections;
create policy "Users can delete own reflections"
  on public.philosophical_reflections for delete
  using ( auth.uid() = user_id );

-- 5. WAITLIST & MEMBERSHIP TABLE
create table if not exists public.waitlist_members (
  id uuid default gen_random_uuid() primary key,
  email text unique not null check (
    char_length(email) between 3 and 255
    and email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  ),
  source text not null default 'website_hero' check (
    char_length(source) between 1 and 50
  ),
  created_at timestamptz not null default now()
);

alter table public.waitlist_members enable row level security;
alter table public.waitlist_members force row level security;

create index if not exists idx_waitlist_email on public.waitlist_members (email);

drop policy if exists "Anyone can join waitlist" on public.waitlist_members;
create policy "Anyone can join waitlist"
  on public.waitlist_members for insert
  with check ( true );

drop policy if exists "Disallow public reading waitlist" on public.waitlist_members;
create policy "Disallow public reading waitlist"
  on public.waitlist_members for select
  using ( false );

-- 6. TRIGGER FUNCTION WITH SEARCH-PATH HARDENING
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_name text;
begin
  v_name := coalesce(
    trim(substring(new.raw_user_meta_data->>'full_name' from 1 for 100)),
    trim(substring(split_part(new.email, '@', 1) from 1 for 100)),
    'Philosopher'
  );

  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    v_name,
    substring(new.raw_user_meta_data->>'avatar_url' from 1 for 1000)
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(excluded.full_name, profiles.full_name),
        updated_at = now();

  return new;
exception
  when others then
    raise warning 'handle_new_user error: %', SQLERRM;
    return new;
end;
$$;

revoke all on function public.handle_new_user() from public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
