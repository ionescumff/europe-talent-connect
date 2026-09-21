CREATE TABLE public.cv_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  sector TEXT NOT NULL,
  country_preference TEXT NOT NULL DEFAULT 'both',
  message TEXT,
  cv_path TEXT,
  cv_filename TEXT,
  status TEXT NOT NULL DEFAULT 'new'
);
GRANT ALL ON public.cv_submissions TO service_role;
ALTER TABLE public.cv_submissions ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.vacancy_enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  company TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  country TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new'
);
GRANT ALL ON public.vacancy_enquiries TO service_role;
ALTER TABLE public.vacancy_enquiries ENABLE ROW LEVEL SECURITY;