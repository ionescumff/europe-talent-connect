CREATE TABLE public.staff_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  user_id uuid NOT NULL,
  actor_id uuid,
  actor_email text,
  kind text NOT NULL DEFAULT 'assignment',
  title text NOT NULL,
  body text,
  entity text,
  entity_id uuid,
  read boolean NOT NULL DEFAULT false,
  emailed boolean NOT NULL DEFAULT false
);

CREATE INDEX staff_notifications_user_idx ON public.staff_notifications (user_id, created_at DESC);

GRANT SELECT, UPDATE ON public.staff_notifications TO authenticated;
GRANT ALL ON public.staff_notifications TO service_role;

ALTER TABLE public.staff_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Own notifications read" ON public.staff_notifications
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Own notifications update" ON public.staff_notifications
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.notify_on_assignment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
declare
  _actor_email text;
  _title text;
  _body text;
begin
  if new.assigned_to is null or new.assigned_to is not distinct from old.assigned_to then
    return new;
  end if;
  if new.assigned_to = coalesce(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid) then
    return new;
  end if;

  select email into _actor_email from public.staff_profiles where user_id = auth.uid();

  if TG_TABLE_NAME = 'cv_submissions' then
    _title := 'New candidate assigned to you';
    _body := new.full_name || ' · ' || new.sector || ' · ' || new.country_preference;
  else
    _title := 'New employer lead assigned to you';
    _body := new.company || ' · ' || new.contact_name || ' · ' || new.country;
  end if;

  insert into public.staff_notifications (user_id, actor_id, actor_email, kind, title, body, entity, entity_id)
  values (new.assigned_to, auth.uid(), _actor_email, 'assignment', _title, _body, TG_TABLE_NAME, new.id);

  return new;
end $$;

CREATE TRIGGER notify_candidate_assignment
  AFTER UPDATE ON public.cv_submissions
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_assignment();

CREATE TRIGGER notify_enquiry_assignment
  AFTER UPDATE ON public.vacancy_enquiries
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_assignment();