create type public.app_role as enum ('admin', 'recruiter');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role public.app_role not null,
  unique (user_id, role)
);
grant select, insert, delete on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create or replace function public.is_staff(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id)
$$;

create policy "Users see own roles, admins see all" on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));
create policy "Admins insert roles" on public.user_roles for insert to authenticated
  with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins delete roles" on public.user_roles for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create table public.staff_profiles (
  user_id uuid primary key,
  email text not null,
  full_name text,
  created_at timestamptz not null default now()
);
grant select, update on public.staff_profiles to authenticated;
grant all on public.staff_profiles to service_role;
alter table public.staff_profiles enable row level security;
create policy "Staff/self can view profiles" on public.staff_profiles for select to authenticated
  using (user_id = auth.uid() or public.is_staff(auth.uid()));
create policy "Self update profile" on public.staff_profiles for update to authenticated
  using (user_id = auth.uid());

create or replace function public.handle_new_staff_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.staff_profiles (user_id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name')
  on conflict do nothing;
  if not exists (select 1 from public.user_roles) then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  end if;
  return new;
end; $$;
create trigger on_auth_user_created_staff after insert on auth.users
for each row execute function public.handle_new_staff_user();

alter table public.cv_submissions add column next_follow_up date;
grant select, update, delete on public.cv_submissions to authenticated;
create policy "Staff view CVs" on public.cv_submissions for select to authenticated using (public.is_staff(auth.uid()));
create policy "Staff update CVs" on public.cv_submissions for update to authenticated using (public.is_staff(auth.uid()));
create policy "Admins delete CVs" on public.cv_submissions for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

grant select, update on public.vacancy_enquiries to authenticated;
create policy "Staff view enquiries" on public.vacancy_enquiries for select to authenticated using (public.is_staff(auth.uid()));
create policy "Staff update enquiries" on public.vacancy_enquiries for update to authenticated using (public.is_staff(auth.uid()));

create table public.candidate_notes (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.cv_submissions(id) on delete cascade,
  author_id uuid not null default auth.uid(),
  author_email text,
  body text not null,
  kind text not null default 'note',
  created_at timestamptz not null default now()
);
grant select, insert, delete on public.candidate_notes to authenticated;
grant all on public.candidate_notes to service_role;
alter table public.candidate_notes enable row level security;
create policy "Staff view notes" on public.candidate_notes for select to authenticated using (public.is_staff(auth.uid()));
create policy "Staff add notes" on public.candidate_notes for insert to authenticated with check (public.is_staff(auth.uid()) and author_id = auth.uid());
create policy "Author or admin delete notes" on public.candidate_notes for delete to authenticated using (author_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

create policy "Staff read CV files" on storage.objects for select to authenticated
  using (bucket_id = 'cvs' and public.is_staff(auth.uid()));