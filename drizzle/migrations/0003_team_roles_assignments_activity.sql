alter type public.app_role add value if not exists 'cofounder';
alter type public.app_role add value if not exists 'manager';
alter type public.app_role add value if not exists 'agency';

alter table public.staff_profiles add column if not exists manager_id uuid;
alter table public.cv_submissions add column if not exists assigned_to uuid;
alter table public.vacancy_enquiries add column if not exists assigned_to uuid;

create or replace function public.role_of(_user_id uuid) returns text
language sql stable security definer set search_path = public as $$
  select role::text from public.user_roles where user_id = _user_id
  order by case role::text when 'admin' then 1 when 'cofounder' then 2 when 'manager' then 3 when 'recruiter' then 4 else 5 end
  limit 1
$$;

create or replace function public.is_admin(_user_id uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role::text in ('admin','cofounder'))
$$;

create or replace function public.is_internal(_user_id uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role::text in ('admin','cofounder','manager','recruiter'))
$$;

create or replace function public.can_edit_lead(_user_id uuid, _assignee uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select public.is_admin(_user_id)
    or (_assignee is not null and _assignee = _user_id and public.is_staff(_user_id))
    or (_assignee is not null and public.role_of(_user_id) = 'manager'
        and exists (select 1 from public.staff_profiles where user_id = _assignee and manager_id = _user_id))
$$;

create or replace function public.can_view_candidate(_user_id uuid, _candidate uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select public.is_internal(_user_id)
    or exists (select 1 from public.cv_submissions where id = _candidate and assigned_to = _user_id)
$$;

create or replace function public.can_edit_candidate(_user_id uuid, _candidate uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.cv_submissions c where c.id = _candidate and public.can_edit_lead(_user_id, c.assigned_to))
$$;

-- cv_submissions
drop policy if exists "Staff view CVs" on public.cv_submissions;
drop policy if exists "Staff update CVs" on public.cv_submissions;
drop policy if exists "Admins delete CVs" on public.cv_submissions;
create policy "View candidates" on public.cv_submissions for select to authenticated
  using (public.is_internal(auth.uid()) or assigned_to = auth.uid());
create policy "Edit candidates" on public.cv_submissions for update to authenticated
  using (public.can_edit_lead(auth.uid(), assigned_to)) with check (public.is_staff(auth.uid()));
create policy "Admins delete candidates" on public.cv_submissions for delete to authenticated
  using (public.is_admin(auth.uid()));

-- vacancy_enquiries
drop policy if exists "Staff view enquiries" on public.vacancy_enquiries;
drop policy if exists "Staff update enquiries" on public.vacancy_enquiries;
create policy "View enquiries" on public.vacancy_enquiries for select to authenticated
  using (public.is_internal(auth.uid()) or assigned_to = auth.uid());
create policy "Edit enquiries" on public.vacancy_enquiries for update to authenticated
  using (public.can_edit_lead(auth.uid(), assigned_to)) with check (public.is_staff(auth.uid()));

-- notes
drop policy if exists "Staff view notes" on public.candidate_notes;
drop policy if exists "Staff add notes" on public.candidate_notes;
drop policy if exists "Author or admin delete notes" on public.candidate_notes;
create policy "View notes" on public.candidate_notes for select to authenticated
  using (public.can_view_candidate(auth.uid(), candidate_id));
create policy "Add notes" on public.candidate_notes for insert to authenticated
  with check (author_id = auth.uid() and public.can_edit_candidate(auth.uid(), candidate_id));
create policy "Author or admin delete notes" on public.candidate_notes for delete to authenticated
  using (author_id = auth.uid() or public.is_admin(auth.uid()));

-- roles: admins and co-founders manage
drop policy if exists "Users see own roles, admins see all" on public.user_roles;
drop policy if exists "Admins insert roles" on public.user_roles;
drop policy if exists "Admins delete roles" on public.user_roles;
create policy "Staff see roles" on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.is_staff(auth.uid()));
create policy "Admins insert roles" on public.user_roles for insert to authenticated
  with check (public.is_admin(auth.uid()));
create policy "Admins delete roles" on public.user_roles for delete to authenticated
  using (public.is_admin(auth.uid()));

create policy "Admins update profiles" on public.staff_profiles for update to authenticated
  using (public.is_admin(auth.uid()));

-- CV files
drop policy if exists "Staff read CV files" on storage.objects;
create policy "Staff read CV files" on storage.objects for select to authenticated
  using (bucket_id = 'cvs' and exists (
    select 1 from public.cv_submissions c where c.cv_path = storage.objects.name
      and (public.is_internal(auth.uid()) or c.assigned_to = auth.uid())));

-- activity log
create table public.activity_log (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  actor_id uuid default auth.uid(),
  actor_email text,
  action text not null,
  entity text not null,
  entity_id uuid,
  details jsonb
);
grant select on public.activity_log to authenticated;
grant all on public.activity_log to service_role;
alter table public.activity_log enable row level security;
create policy "Admins view activity" on public.activity_log for select to authenticated
  using (public.is_admin(auth.uid()));

create or replace function public.log_activity() returns trigger
language plpgsql security definer set search_path = public as $$
declare _email text; _d jsonb := '{}'::jsonb; _action text;
begin
  select email into _email from public.staff_profiles where user_id = auth.uid();
  if TG_TABLE_NAME in ('cv_submissions','vacancy_enquiries') then
    if new.status is distinct from old.status then _d := _d || jsonb_build_object('status', jsonb_build_array(old.status, new.status)); end if;
    if new.assigned_to is distinct from old.assigned_to then _d := _d || jsonb_build_object('assigned_to', jsonb_build_array(old.assigned_to, new.assigned_to)); end if;
    if TG_TABLE_NAME = 'cv_submissions' and new.next_follow_up is distinct from old.next_follow_up then _d := _d || jsonb_build_object('follow_up', new.next_follow_up); end if;
    if _d = '{}'::jsonb then return new; end if;
    insert into public.activity_log (actor_id, actor_email, action, entity, entity_id, details)
      values (auth.uid(), _email, 'updated', TG_TABLE_NAME, new.id, _d);
    return new;
  elsif TG_TABLE_NAME = 'candidate_notes' then
    insert into public.activity_log (actor_id, actor_email, action, entity, entity_id, details)
      values (auth.uid(), _email, 'logged ' || new.kind, 'cv_submissions', new.candidate_id, null);
    return new;
  elsif TG_TABLE_NAME = 'user_roles' then
    if TG_OP = 'INSERT' then
      insert into public.activity_log (actor_id, actor_email, action, entity, entity_id, details)
        values (auth.uid(), _email, 'granted role', 'staff', new.user_id, jsonb_build_object('role', new.role));
      return new;
    else
      insert into public.activity_log (actor_id, actor_email, action, entity, entity_id, details)
        values (auth.uid(), _email, 'removed role', 'staff', old.user_id, jsonb_build_object('role', old.role));
      return old;
    end if;
  end if;
  return coalesce(new, old);
end $$;

create trigger log_cv_changes after update on public.cv_submissions for each row execute function public.log_activity();
create trigger log_enquiry_changes after update on public.vacancy_enquiries for each row execute function public.log_activity();
create trigger log_notes after insert on public.candidate_notes for each row execute function public.log_activity();
create trigger log_roles after insert or delete on public.user_roles for each row execute function public.log_activity();