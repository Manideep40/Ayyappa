-- Darshan booking backend schema and functions

-- Tables
create table if not exists public.darshan_bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  booking_date date not null,
  time_slot text not null,
  status text not null default 'confirmed' check (status in ('confirmed','cancelled')),
  created_at timestamptz not null default now()
);

-- Enforce valid time format HH:MM
alter table public.darshan_bookings
  add constraint if not exists time_slot_format
  check (time_slot ~ '^[0-2][0-9]:[0-5][0-9]$');

-- Prevent duplicate active bookings for the same user & slot
create unique index if not exists darshan_unique_user_slot
  on public.darshan_bookings (user_id, booking_date, time_slot)
  where status = 'confirmed';

-- Optional: per-slot capacity overrides
create table if not exists public.darshan_slot_limits (
  booking_date date not null,
  time_slot text not null,
  capacity integer not null check (capacity > 0),
  primary key (booking_date, time_slot)
);

alter table public.darshan_slot_limits
  add constraint if not exists darshan_slot_limits_time_format
  check (time_slot ~ '^[0-2][0-9]:[0-5][0-9]$');

-- RLS
alter table public.darshan_bookings enable row level security;

do $$
begin
  -- Select own bookings
  if not exists (
    select 1 from pg_policies p
    where p.schemaname = 'public' and p.tablename = 'darshan_bookings' and p.policyname = 'select own bookings'
  ) then
    create policy "select own bookings"
      on public.darshan_bookings for select to authenticated
      using (auth.uid() = user_id);
  end if;

  -- Insert own bookings (function inserts with user_id = auth.uid())
  if not exists (
    select 1 from pg_policies p
    where p.schemaname = 'public' and p.tablename = 'darshan_bookings' and p.policyname = 'insert own bookings'
  ) then
    create policy "insert own bookings"
      on public.darshan_bookings for insert to authenticated
      with check (auth.uid() = user_id);
  end if;

  -- Update/cancel own bookings only
  if not exists (
    select 1 from pg_policies p
    where p.schemaname = 'public' and p.tablename = 'darshan_bookings' and p.policyname = 'update own bookings'
  ) then
    create policy "update own bookings"
      on public.darshan_bookings for update to authenticated
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
end $$;

-- Helper: capacity lookup
create or replace function public.darshan_capacity(p_date date, p_time text)
returns integer
language sql
stable
as $$
  select coalesce(
    (select capacity from public.darshan_slot_limits where booking_date = p_date and time_slot = p_time),
    50 -- default capacity per slot
  );
$$;

-- RPC: book a slot atomically with capacity check
create or replace function public.book_darshan(p_date date, p_time text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid;
  v_cap integer;
  v_count integer;
  v_id uuid;
begin
  v_uid := auth.uid();
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  if p_time !~ '^[0-2][0-9]:[0-5][0-9]$' then
    raise exception 'invalid_time_format';
  end if;

  v_cap := public.darshan_capacity(p_date, p_time);

  select count(*) into v_count
  from public.darshan_bookings
  where booking_date = p_date and time_slot = p_time and status = 'confirmed';

  if v_count >= v_cap then
    raise exception 'slot_full';
  end if;

  -- Prevent duplicate active booking for same user/slot
  if exists (
    select 1 from public.darshan_bookings
    where user_id = v_uid and booking_date = p_date and time_slot = p_time and status = 'confirmed'
  ) then
    raise exception 'already_booked';
  end if;

  insert into public.darshan_bookings (user_id, booking_date, time_slot)
  values (v_uid, p_date, p_time)
  returning id into v_id;

  return v_id;
end;
$$;

-- RPC: list times that are fully booked for a given date
create or replace function public.darshan_full_times(p_date date)
returns table(time_slot text)
language sql
stable
as $$
  with counts as (
    select time_slot, count(*) as c
    from public.darshan_bookings
    where booking_date = p_date and status = 'confirmed'
    group by time_slot
  )
  select c.time_slot
  from counts c
  where c.c >= public.darshan_capacity(p_date, c.time_slot);
$$;

