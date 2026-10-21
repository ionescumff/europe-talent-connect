<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Apply the approved editorial design through a scoped public-site wrapper; preserve CRM styling and retain `/test` as a separate experiment.
- Keep the test career-advice gallery in its own browser-safe component; reference spreadsheets inform the layout rather than importing third-party stories or claims.
- Candidate spreadsheet imports use authenticated admin-only server functions with explicit column mapping and duplicate checks; CVs remain in private storage.
- Job applicants use the existing job/candidate link table; direct applications synchronize links by confirmed vacancy slug so all applicant views share the same records.
- Candidate accounts use public.profiles without staff roles; a restricted status RPC resolves applications only from the authenticated user's confirmed email and projects no internal notes or CV paths.
- Ship bilingual editable CV templates as same-origin static downloads to keep document generation out of the server runtime.
