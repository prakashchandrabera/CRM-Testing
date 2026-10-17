-- ============================================================
-- Job CRM schema. Run once in Supabase > SQL Editor.
-- ============================================================

-- 1. Types -----------------------------------------------------
create type public.user_role as enum ('employee', 'sales');
create type public.job_status as enum ('draft', 'sent');

-- 2. Profiles (one role per account, set only by an admin) ----
create table public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  role       public.user_role not null,
  full_name  text,
  created_at timestamptz not null default now()
);

-- Helper: role of the current user (security definer avoids RLS recursion)
create or replace function public.app_role()
returns public.user_role
language sql stable security definer set search_path = public
as $$ select role from public.profiles where id = auth.uid() $$;

-- 3. Jobs -------------------------------------------------------
create table public.jobs (
  id                  uuid primary key default gen_random_uuid(),
  job_number          bigint generated always as identity (start with 1001) unique,
  first_name          text not null,
  last_name           text not null default '',
  email               text not null default '',
  phone               text not null default '',
  additional_comments text not null default '',
  status              public.job_status not null default 'draft',
  pass_count          int not null default 0,
  approved_count      int not null default 0,
  created_by          uuid not null default auth.uid() references auth.users (id) on delete cascade,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  sent_at             timestamptz
);
create index jobs_status_sent_idx on public.jobs (status, sent_at desc);
create index jobs_created_by_idx on public.jobs (created_by, job_number desc);

-- 4. Votes (each sales user has one vote per job) ---------------
create table public.job_votes (
  job_id     uuid not null references public.jobs (id) on delete cascade,
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  vote       text not null check (vote in ('pass', 'approved')),
  created_at timestamptz not null default now(),
  primary key (job_id, user_id)
);

-- 5. Triggers ---------------------------------------------------
create or replace function public.jobs_guard()
returns trigger language plpgsql as $$
begin
  if tg_op = 'INSERT' then
    if new.status = 'sent' and new.sent_at is null then new.sent_at := now(); end if;
  else
    new.updated_at := now();
    -- employees can never touch counts or ownership
    if public.app_role() = 'employee' then
      new.pass_count     := old.pass_count;
      new.approved_count := old.approved_count;
      new.created_by     := old.created_by;
    end if;
  end if;
  return new;
end $$;

create trigger jobs_guard_trg before insert or update on public.jobs
for each row execute function public.jobs_guard();

create or replace function public.sync_vote_counts()
returns trigger language plpgsql security definer set search_path = public as $$
declare jid uuid := coalesce(new.job_id, old.job_id);
begin
  update public.jobs j set
    pass_count     = (select count(*) from public.job_votes v where v.job_id = jid and v.vote = 'pass'),
    approved_count = (select count(*) from public.job_votes v where v.job_id = jid and v.vote = 'approved')
  where j.id = jid;
  return null;
end $$;

create trigger job_votes_sync_trg after insert or update or delete on public.job_votes
for each row execute function public.sync_vote_counts();

-- 6. Row Level Security -----------------------------------------
alter table public.profiles  enable row level security;
alter table public.jobs      enable row level security;
alter table public.job_votes enable row level security;

-- profiles: read your own; nobody can write from the app
create policy "read own profile" on public.profiles
  for select using (id = auth.uid());

-- jobs: employees manage only their own jobs
create policy "employee select" on public.jobs for select
  using (public.app_role() = 'employee' and created_by = auth.uid());
create policy "employee insert" on public.jobs for insert
  with check (public.app_role() = 'employee' and created_by = auth.uid()
              and pass_count = 0 and approved_count = 0);
create policy "employee update" on public.jobs for update
  using (public.app_role() = 'employee' and created_by = auth.uid())
  with check (public.app_role() = 'employee' and created_by = auth.uid());
create policy "employee delete" on public.jobs for delete
  using (public.app_role() = 'employee' and created_by = auth.uid());

-- jobs: sales see (and can delete) only jobs that were sent to CRM
create policy "sales select" on public.jobs for select
  using (public.app_role() = 'sales' and status = 'sent');
create policy "sales delete" on public.jobs for delete
  using (public.app_role() = 'sales' and status = 'sent');

-- votes: sales only, own vote only
create policy "sales read own votes" on public.job_votes for select
  using (public.app_role() = 'sales' and user_id = auth.uid());
create policy "sales vote" on public.job_votes for insert
  with check (public.app_role() = 'sales' and user_id = auth.uid()
              and exists (select 1 from public.jobs j where j.id = job_id and j.status = 'sent'));
create policy "sales change vote" on public.job_votes for update
  using (public.app_role() = 'sales' and user_id = auth.uid())
  with check (public.app_role() = 'sales' and user_id = auth.uid());

-- 7. Realtime: sales lists update the moment an employee clicks Send CRM
alter publication supabase_realtime add table public.jobs;
