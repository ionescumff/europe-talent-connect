CREATE TABLE public.job_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  email text NOT NULL,
  sectors text[] NOT NULL DEFAULT '{}',
  city text,
  lang text NOT NULL DEFAULT 'ro' CHECK (lang IN ('ro','en')),
  active boolean NOT NULL DEFAULT true,
  last_sent_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_alerts TO authenticated;
GRANT ALL ON public.job_alerts TO service_role;
ALTER TABLE public.job_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own alert read" ON public.job_alerts FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Own alert insert" ON public.job_alerts FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Own alert update" ON public.job_alerts FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Own alert delete" ON public.job_alerts FOR DELETE TO authenticated USING (user_id = auth.uid());