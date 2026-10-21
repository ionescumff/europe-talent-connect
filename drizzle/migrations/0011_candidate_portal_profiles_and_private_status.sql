CREATE TABLE public.profiles (
 id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 full_name text NOT NULL DEFAULT '',
 phone text NOT NULL DEFAULT '',
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Candidates read own profile" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Candidates update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE OR REPLACE FUNCTION public.create_candidate_profile() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
 INSERT INTO public.profiles(id, full_name, phone) VALUES (NEW.id, left(coalesce(NEW.raw_user_meta_data->>'full_name',''),120), left(coalesce(NEW.raw_user_meta_data->>'phone',''),40)) ON CONFLICT DO NOTHING;
 RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created_candidate_profile AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.create_candidate_profile();
INSERT INTO public.profiles(id,full_name) SELECT id,left(coalesce(raw_user_meta_data->>'full_name',''),120) FROM auth.users ON CONFLICT DO NOTHING;
CREATE OR REPLACE FUNCTION public.handle_new_staff_user() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
 IF coalesce(NEW.raw_user_meta_data->>'account_type','') <> 'candidate' THEN
  INSERT INTO public.staff_profiles(user_id,email,full_name) VALUES (NEW.id,NEW.email,NEW.raw_user_meta_data->>'full_name') ON CONFLICT DO NOTHING;
 END IF;
 -- Staff privileges are assigned by existing administrators, never by signup metadata or signup order.
 RETURN NEW;
END; $$;
CREATE OR REPLACE FUNCTION public.candidate_portal_data() RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE verified_email text; result jsonb;
BEGIN
 SELECT lower(trim(email)) INTO verified_email FROM auth.users WHERE id = auth.uid() AND email_confirmed_at IS NOT NULL;
 IF verified_email IS NULL THEN RAISE EXCEPTION 'Confirm your email before viewing applications'; END IF;
 SELECT jsonb_build_object('profile', (SELECT jsonb_build_object('full_name',full_name,'phone',phone) FROM public.profiles WHERE id = auth.uid()), 'applications', coalesce((
 SELECT jsonb_agg(jsonb_build_object('id',c.id,'created_at',c.created_at,'status',c.status,'sector',c.sector,'country_preference',c.country_preference,'jobs', coalesce((SELECT jsonb_agg(jsonb_build_object('title',j.title,'city',j.city,'country',j.country)) FROM public.job_post_candidates l JOIN public.job_posts j ON j.id=l.job_id WHERE l.candidate_id=c.id),'[]'::jsonb)) ORDER BY c.created_at DESC)
 FROM public.cv_submissions c WHERE lower(trim(c.email)) = verified_email
 ),'[]'::jsonb)) INTO result;
 RETURN result;
END; $$;
REVOKE ALL ON FUNCTION public.candidate_portal_data() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.candidate_portal_data() TO authenticated;
CREATE OR REPLACE FUNCTION public.update_candidate_profile(_full_name text, _phone text) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
 IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Unauthorized'; END IF;
 IF length(trim(_full_name)) < 2 OR length(trim(_full_name)) > 120 OR length(trim(_phone)) > 40 THEN RAISE EXCEPTION 'Invalid profile'; END IF;
 UPDATE public.profiles SET full_name=trim(_full_name),phone=trim(_phone) WHERE id=auth.uid();
END; $$;
REVOKE ALL ON FUNCTION public.update_candidate_profile(text,text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.update_candidate_profile(text,text) TO authenticated;