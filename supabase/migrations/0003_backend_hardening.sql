-- MIGRATION 0003: PRODUCTION BACKEND HARDENING

alter table public.contact_messages
  add column if not exists request_fingerprint text
  check (request_fingerprint is null or char_length(request_fingerprint) = 64);

alter table public.waitlist_members
  add column if not exists request_fingerprint text
  check (request_fingerprint is null or char_length(request_fingerprint) = 64);

create index if not exists idx_contact_request_fingerprint
  on public.contact_messages (request_fingerprint, created_at desc);
create index if not exists idx_waitlist_request_fingerprint
  on public.waitlist_members (request_fingerprint, created_at desc);

with ranked_bookmarks as (
  select id,
         row_number() over (
           partition by user_id, course_id
           order by created_at desc, id desc
         ) as row_number
  from public.user_bookmarks
)
delete from public.user_bookmarks
where id in (select id from ranked_bookmarks where row_number > 1);

create unique index if not exists idx_bookmarks_unique_user_course
  on public.user_bookmarks (user_id, course_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
revoke all on function public.set_updated_at() from public;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
drop trigger if exists set_reflections_updated_at on public.philosophical_reflections;
create trigger set_reflections_updated_at before update on public.philosophical_reflections
  for each row execute function public.set_updated_at();
drop trigger if exists set_dilemma_votes_updated_at on public.dilemma_votes;
create trigger set_dilemma_votes_updated_at before update on public.dilemma_votes
  for each row execute function public.set_updated_at();

revoke all on public.profiles from anon, authenticated;
grant select, update on public.profiles to authenticated;
revoke all on public.user_course_progress from anon, authenticated;
grant select, insert, update, delete on public.user_course_progress to authenticated;
revoke all on public.user_bookmarks from anon, authenticated;
grant select, insert, delete on public.user_bookmarks to authenticated;
revoke all on public.philosophical_reflections from anon, authenticated;
grant select, insert, update, delete on public.philosophical_reflections to authenticated;
revoke all on public.waitlist_members from anon, authenticated;
revoke all on public.contact_messages from anon, authenticated;
revoke all on public.dilemma_votes from anon, authenticated;
grant all on public.waitlist_members to service_role;
grant all on public.contact_messages to service_role;
grant all on public.dilemma_votes to service_role;

drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
drop policy if exists "Users can update only their own profile" on public.profiles;
drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can view their own profile"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);
create policy "Users can update their own profile"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

drop policy if exists "Users can view own course progress" on public.user_course_progress;
drop policy if exists "Users can insert own course progress" on public.user_course_progress;
drop policy if exists "Users can update own course progress" on public.user_course_progress;
drop policy if exists "Users can delete own course progress" on public.user_course_progress;
create policy "Users can view own course progress"
  on public.user_course_progress for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Users can insert own course progress"
  on public.user_course_progress for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "Users can update own course progress"
  on public.user_course_progress for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "Users can delete own course progress"
  on public.user_course_progress for delete to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can read own bookmarks" on public.user_bookmarks;
drop policy if exists "Users can add own bookmarks" on public.user_bookmarks;
drop policy if exists "Users can delete own bookmarks" on public.user_bookmarks;
create policy "Users can read own bookmarks"
  on public.user_bookmarks for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Users can add own bookmarks"
  on public.user_bookmarks for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "Users can delete own bookmarks"
  on public.user_bookmarks for delete to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can read own reflections" on public.philosophical_reflections;
drop policy if exists "Users can write own reflections" on public.philosophical_reflections;
drop policy if exists "Users can update own reflections" on public.philosophical_reflections;
drop policy if exists "Users can delete own reflections" on public.philosophical_reflections;
create policy "Users can read own reflections"
  on public.philosophical_reflections for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Users can write own reflections"
  on public.philosophical_reflections for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "Users can update own reflections"
  on public.philosophical_reflections for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "Users can delete own reflections"
  on public.philosophical_reflections for delete to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Anyone can join waitlist" on public.waitlist_members;
drop policy if exists "Disallow public reading waitlist" on public.waitlist_members;
drop policy if exists "Anyone can submit contact message" on public.contact_messages;
drop policy if exists "Disallow public reading contact messages" on public.contact_messages;
drop policy if exists "Anyone can view dilemma votes" on public.dilemma_votes;
drop policy if exists "Anyone can cast dilemma vote" on public.dilemma_votes;
drop policy if exists "Voter can update own vote" on public.dilemma_votes;

revoke all on function public.get_dilemma_stats(text) from public, anon, authenticated;
grant execute on function public.get_dilemma_stats(text) to service_role;

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
    nullif(trim(substring(new.raw_user_meta_data->>'full_name' from 1 for 100)), ''),
    nullif(trim(substring(split_part(new.email, '@', 1) from 1 for 100)), ''),
    'Philosopher'
  );
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    v_name,
    nullif(substring(new.raw_user_meta_data->>'avatar_url' from 1 for 1000), '')
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
revoke all on function public.handle_new_user() from public, anon, authenticated;
