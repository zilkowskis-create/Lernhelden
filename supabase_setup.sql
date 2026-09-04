-- Lernhelden v7 – Supabase Setup
-- Im Supabase Dashboard unter SQL Editor einmal ausführen.

create extension if not exists pgcrypto;

create table if not exists public.families (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'Meine Familie',
  created_at timestamptz not null default now(),
  unique(owner_id)
);

create table if not exists public.children (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 50),
  class_level integer not null check (class_level between 1 and 6),
  created_at timestamptz not null default now()
);

create table if not exists public.learning_sessions (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  active_seconds integer not null default 0 check (active_seconds >= 0)
);

create table if not exists public.attempts (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  subject text not null,
  topic text,
  question text,
  correct boolean not null,
  answer text,
  correct_answer text,
  created_at timestamptz not null default now()
);

alter table public.families enable row level security;
alter table public.children enable row level security;
alter table public.learning_sessions enable row level security;
alter table public.attempts enable row level security;

revoke all on public.families from anon;
revoke all on public.children from anon;
revoke all on public.learning_sessions from anon;
revoke all on public.attempts from anon;

grant select,insert,update,delete on public.families to authenticated;
grant select,insert,update,delete on public.children to authenticated;
grant select,insert,update,delete on public.learning_sessions to authenticated;
grant select,insert,update,delete on public.attempts to authenticated;

drop policy if exists "families_owner_all" on public.families;
create policy "families_owner_all" on public.families
for all to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

drop policy if exists "children_family_owner_all" on public.children;
create policy "children_family_owner_all" on public.children
for all to authenticated
using (
  exists(select 1 from public.families f where f.id=children.family_id and f.owner_id=auth.uid())
)
with check (
  exists(select 1 from public.families f where f.id=children.family_id and f.owner_id=auth.uid())
);

drop policy if exists "sessions_family_owner_all" on public.learning_sessions;
create policy "sessions_family_owner_all" on public.learning_sessions
for all to authenticated
using (
  exists(
    select 1 from public.children c
    join public.families f on f.id=c.family_id
    where c.id=learning_sessions.child_id and f.owner_id=auth.uid()
  )
)
with check (
  exists(
    select 1 from public.children c
    join public.families f on f.id=c.family_id
    where c.id=learning_sessions.child_id and f.owner_id=auth.uid()
  )
);

drop policy if exists "attempts_family_owner_all" on public.attempts;
create policy "attempts_family_owner_all" on public.attempts
for all to authenticated
using (
  exists(
    select 1 from public.children c
    join public.families f on f.id=c.family_id
    where c.id=attempts.child_id and f.owner_id=auth.uid()
  )
)
with check (
  exists(
    select 1 from public.children c
    join public.families f on f.id=c.family_id
    where c.id=attempts.child_id and f.owner_id=auth.uid()
  )
);


-- v7.1 family settings
create table if not exists public.family_settings (
 family_id uuid primary key references public.families(id) on delete cascade,
 sound_enabled boolean not null default true,
 effects_enabled boolean not null default true,
 updated_at timestamptz not null default now()
);
alter table public.family_settings enable row level security;
grant select,insert,update,delete on public.family_settings to authenticated;
drop policy if exists "settings_family_owner_all" on public.family_settings;
create policy "settings_family_owner_all" on public.family_settings
for all to authenticated
using (exists(select 1 from public.families f where f.id=family_settings.family_id and f.owner_id=auth.uid()))
with check (exists(select 1 from public.families f where f.id=family_settings.family_id and f.owner_id=auth.uid()));
