ALTER TABLE public.job_posts
  ADD COLUMN slug text UNIQUE,
  ADD COLUMN company_name text,
  ADD COLUMN company_details text,
  ADD COLUMN contract text,
  ADD COLUMN schedule text,
  ADD COLUMN start_date text,
  ADD COLUMN housing text,
  ADD COLUMN transport text,
  ADD COLUMN language text,
  ADD COLUMN openings integer NOT NULL DEFAULT 1,
  ADD COLUMN tasks text[] NOT NULL DEFAULT '{}',
  ADD COLUMN requirements text[] NOT NULL DEFAULT '{}',
  ADD COLUMN benefits text[] NOT NULL DEFAULT '{}',
  ADD COLUMN image_url text,
  ADD COLUMN published boolean NOT NULL DEFAULT false;
GRANT SELECT ON public.job_posts TO anon;
CREATE POLICY "Public reads published jobs" ON public.job_posts FOR SELECT TO anon, authenticated
  USING (published AND status = 'open');