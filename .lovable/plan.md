# Romanian recruitment hook above the CV form

## What you'll see

A new full-width band on the homepage, sitting directly between the four-steps panel and the "Leave your CV" form. It speaks to candidates in plain Romanian:

> Vrei să pleci în afară, să te duci în Germania sau în Olanda, în Europa de fapt, la muncă? Aplică cu noi!

With the language switch on **EN**, the same band reads:

> Want to work abroad — Germany, the Netherlands, anywhere in Europe? Apply with us!

"Aplică cu noi!" / "Apply with us!" doubles as a gold button that scrolls the visitor straight to the CV form.

## Layout

```text
[ Four steps panel ]
------------------------------------------------
|  Vrei să pleci în afară, să te duci în      |
|  Germania sau în Olanda, în Europa de       |
|  fapt, la muncă?                            |
|                                             |
|  [ Aplică cu noi! ]                         |
------------------------------------------------
[ Leave your CV form ]
```

- One rounded band, same navy-and-gold look as the rest of the homepage — no new colours.
- Large display heading, sized down on phones so nothing spills off the screen.
- "Germania" and "Olanda" carry the gold accent so the destinations stand out; the wording itself is unchanged.
- The button is the only new clickable element; it jumps to `#cv`, the same target as the existing "Leave your CV" button.

## Files

- **New:** `src/components/site/CandidateBand.tsx` — the band, bilingual via the existing `useLang` hook.
- **Edit:** `src/routes/index.tsx` — render `<CandidateBand />` between `<Process />` and `<CvForm />`.

## Technical details

- Copy supplied verbatim by Matei; English counterpart mirrors it. No invented facts, no fee claims beyond what is already stated.
- Styling uses existing design tokens (`glass-card`, `bg-brand`, `text-accent`, `font-display`) — nothing hardcoded, so dark/light and the CRM theme are untouched.
- Employer sections, CRM and the `/test` page are not modified.
- Page metadata for `/` stays as is; the band is visible content, not a new route.

## Verification

- `bunx tsgo --noEmit` for type errors, plus the build log.
- Playwright at desktop (1280×1800) and phone (393×784): band renders in both EN and RO, button scrolls to the CV form, no horizontal overflow, no console errors.
