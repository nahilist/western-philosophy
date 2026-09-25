-- ==============================================================================
-- MIGRATION 0002: CONTACT MESSAGES & PHILOSOPHICAL DILEMMA VOTES
-- ------------------------------------------------------------------------------
-- Adds persistence for contact inquiries and ethical dilemma polls with
-- anti-spam constraints, unique voter limits, and lightning-fast aggregates.
-- ==============================================================================

-- 1. CONTACT INQUIRIES & MESSAGES TABLE
create table if not exists public.contact_messages (
  id uuid default gen_random_uuid() primary key,
  name text not null check (
    char_length(name) between 2 and 100
  ),
  email text not null check (
    char_length(email) between 3 and 255
    and email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  ),
  subject text not null check (
    char_length(subject) between 2 and 150
  ),
  message text not null check (
    char_length(message) between 5 and 3000
  ),
  status text not null default 'unread' check (
    status in ('unread', 'read', 'replied', 'archived')
  ),
  ip_address text check (
    char_length(ip_address) <= 45
  ),
  created_at timestamptz not null default now()
);

-- Force Row-Level Security
alter table public.contact_messages enable row level security;
alter table public.contact_messages force row level security;

-- Performance Index for admin inquiry triaging
create index if not exists idx_contact_created_status 
  on public.contact_messages (status, created_at desc);

-- Security Policies
-- Public can ONLY insert valid inquiries
drop policy if exists "Anyone can submit contact message" on public.contact_messages;
create policy "Anyone can submit contact message"
  on public.contact_messages for insert
  with check ( true );

-- Public CANNOT read, dump, or scrape submitted messages
drop policy if exists "Disallow public reading contact messages" on public.contact_messages;
create policy "Disallow public reading contact messages"
  on public.contact_messages for select
  using ( false );


-- 2. PHILOSOPHICAL DILEMMA VOTES TABLE
create table if not exists public.dilemma_votes (
  id uuid default gen_random_uuid() primary key,
  voter_identifier text not null check (
    char_length(voter_identifier) between 8 and 100
  ),
  dilemma_id text not null check (
    char_length(dilemma_id) between 1 and 50
    and dilemma_id ~ '^[a-z0-9_-]+$'
  ),
  selected_choice text not null check (
    char_length(selected_choice) between 1 and 100
  ),
  user_id uuid references auth.users on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Guarantees one vote per voter per dilemma (prevents ballot stuffing)
  constraint unique_voter_dilemma unique (voter_identifier, dilemma_id)
);

-- Force Row-Level Security
alter table public.dilemma_votes enable row level security;
alter table public.dilemma_votes force row level security;

-- Performance Composite Indexes
create index if not exists idx_dilemma_votes_aggregate 
  on public.dilemma_votes (dilemma_id, selected_choice);

create index if not exists idx_dilemma_voter 
  on public.dilemma_votes (voter_identifier, dilemma_id);

-- Security Policies
-- Anyone can read dilemma votes (necessary for calculating community percentages)
drop policy if exists "Anyone can view dilemma votes" on public.dilemma_votes;
create policy "Anyone can view dilemma votes"
  on public.dilemma_votes for select
  using ( true );

-- Anyone can cast their initial vote
drop policy if exists "Anyone can cast dilemma vote" on public.dilemma_votes;
create policy "Anyone can cast dilemma vote"
  on public.dilemma_votes for insert
  with check ( true );

-- Voters can change/update their own choice
drop policy if exists "Voter can update own vote" on public.dilemma_votes;
create policy "Voter can update own vote"
  on public.dilemma_votes for update
  using ( voter_identifier = current_setting('request.headers', true)::json->>'x-voter-id' or auth.uid() = user_id )
  with check ( true );


-- 3. STORED PROCEDURE: GET DILEMMA POLL AGGREGATES
-- Returns breakdown of counts and percentages for a given dilemma in single DB roundtrip
create or replace function public.get_dilemma_stats(p_dilemma_id text)
returns json
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_total bigint;
  v_results json;
begin
  select count(*) into v_total 
  from public.dilemma_votes 
  where dilemma_id = p_dilemma_id;

  if v_total = 0 then
    return json_build_object(
      'total', 0,
      'stats', json_build_array()
    );
  end if;

  select json_build_object(
    'total', v_total,
    'stats', json_agg(
      json_build_object(
        'choice', selected_choice,
        'count', cnt,
        'percentage', round((cnt::numeric / v_total::numeric) * 100, 1)
      )
    )
  ) into v_results
  from (
    select selected_choice, count(*) as cnt
    from public.dilemma_votes
    where dilemma_id = p_dilemma_id
    group by selected_choice
    order by cnt desc
  ) t;

  return v_results;
end;
$$;

-- Allow public execution of stats aggregation function
grant execute on function public.get_dilemma_stats(text) to anon, authenticated, service_role;
