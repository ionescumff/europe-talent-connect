CREATE OR REPLACE FUNCTION public.sync_candidate_application() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE vacancy uuid;
BEGIN
  IF NEW.applied_job IS NOT NULL THEN
    SELECT id INTO vacancy FROM public.job_posts WHERE slug = NEW.applied_job OR id::text = NEW.applied_job LIMIT 1;
    IF vacancy IS NOT NULL THEN
      INSERT INTO public.job_post_candidates(job_id, candidate_id) VALUES (vacancy, NEW.id) ON CONFLICT DO NOTHING;
    END IF;
  END IF;
  RETURN NEW;
END; $$;
REVOKE ALL ON FUNCTION public.sync_candidate_application() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER sync_candidate_application AFTER INSERT OR UPDATE OF applied_job ON public.cv_submissions FOR EACH ROW EXECUTE FUNCTION public.sync_candidate_application();
INSERT INTO public.job_post_candidates(job_id, candidate_id) SELECT j.id, c.id FROM public.cv_submissions c JOIN public.job_posts j ON j.slug = c.applied_job OR j.id::text = c.applied_job ON CONFLICT DO NOTHING;