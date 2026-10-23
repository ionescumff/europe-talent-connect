grant delete on public.staff_profiles to authenticated;

create policy "Admins delete staff profiles"
  on public.staff_profiles for delete to authenticated
  using (public.is_admin(auth.uid()));