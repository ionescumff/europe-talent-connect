CREATE TABLE public.job_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  title text NOT NULL,
  sector text NOT NULL,
  country text NOT NULL,
  city text NOT NULL,
  salary text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'open',
  created_by uuid DEFAULT auth.uid()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_posts TO authenticated;
GRANT ALL ON public.job_posts TO service_role;
ALTER TABLE public.job_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage job posts" ON public.job_posts FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

CREATE TABLE public.job_post_candidates (
  job_id uuid NOT NULL REFERENCES public.job_posts(id) ON DELETE CASCADE,
  candidate_id uuid NOT NULL REFERENCES public.cv_submissions(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (job_id, candidate_id)
);
GRANT SELECT, INSERT, DELETE ON public.job_post_candidates TO authenticated;
GRANT ALL ON public.job_post_candidates TO service_role;
ALTER TABLE public.job_post_candidates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage job links" ON public.job_post_candidates FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));