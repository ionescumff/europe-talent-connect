DROP POLICY IF EXISTS "Public reads job events" ON public.job_post_events;
CREATE POLICY "Public reads events for published jobs" ON public.job_post_events
FOR SELECT TO anon, authenticated
USING (
  created_at > now() - interval '30 days'
  AND EXISTS (SELECT 1 FROM public.job_posts j WHERE j.slug = job_post_events.job_slug AND j.published AND j.status = 'open')
);
CREATE POLICY "Admins read all job events" ON public.job_post_events
FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));