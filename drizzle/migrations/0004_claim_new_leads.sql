CREATE OR REPLACE FUNCTION public.claim_lead(_table text, _id uuid)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
declare n int;
begin
  if not public.is_internal(auth.uid()) then raise exception 'Not allowed'; end if;
  if _table = 'cv_submissions' then
    update public.cv_submissions set assigned_to = auth.uid() where id = _id and assigned_to is null;
  elsif _table = 'vacancy_enquiries' then
    update public.vacancy_enquiries set assigned_to = auth.uid() where id = _id and assigned_to is null;
  else raise exception 'Bad table'; end if;
  get diagnostics n = row_count;
  return n > 0;
end $$;
REVOKE ALL ON FUNCTION public.claim_lead(text, uuid) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.claim_lead(text, uuid) TO authenticated;