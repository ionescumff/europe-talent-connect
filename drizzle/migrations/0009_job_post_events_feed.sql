create table public.job_post_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  action text not null,
  job_slug text,
  title text not null,
  city text,
  country text
);
grant select on public.job_post_events to anon, authenticated;
grant all on public.job_post_events to service_role;
alter table public.job_post_events enable row level security;
create policy "Public reads job events" on public.job_post_events for select to anon, authenticated using (true);

create or replace function public.log_job_post_event()
returns trigger language plpgsql security definer set search_path = public as $$
declare was_live boolean; is_live boolean; act text; r record;
begin
  was_live := TG_OP <> 'INSERT' and old.published and old.status = 'open';
  is_live := TG_OP <> 'DELETE' and new.published and new.status = 'open';
  if is_live and not was_live then act := 'published';
  elsif is_live and was_live then
    if (new.title, new.salary, new.city, new.description, new.image_url) is not distinct from (old.title, old.salary, old.city, old.description, old.image_url) then return new; end if;
    act := 'updated';
  elsif was_live and not is_live then act := 'removed';
  else return coalesce(new, old); end if;
  if TG_OP = 'DELETE' then r := old; else r := new; end if;
  insert into public.job_post_events (action, job_slug, title, city, country)
    values (act, case when act = 'removed' then null else coalesce(r.slug, r.id::text) end, r.title, r.city, r.country);
  return coalesce(new, old);
end $$;

create trigger job_post_events_trg after insert or update or delete on public.job_posts
for each row execute function public.log_job_post_event();

alter publication supabase_realtime add table public.job_post_events;