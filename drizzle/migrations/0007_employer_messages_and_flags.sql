CREATE TABLE public.employer_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  company text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text NOT NULL,
  body text NOT NULL,
  status text NOT NULL DEFAULT 'unread',
  reply text,
  replied_at timestamptz,
  replied_by uuid
);
GRANT SELECT, UPDATE, DELETE ON public.employer_messages TO authenticated;
GRANT ALL ON public.employer_messages TO service_role;
ALTER TABLE public.employer_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read messages" ON public.employer_messages FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins update messages" ON public.employer_messages FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins delete messages" ON public.employer_messages FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

ALTER TABLE public.cv_submissions ADD COLUMN flagged boolean NOT NULL DEFAULT false;
ALTER TABLE public.cv_submissions ADD COLUMN flag_note text;
