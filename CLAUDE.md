# Dr. Celal Alioglu — US Revision Rhinoplasty LP · Agent Guide

## What this repository is

A single-page, conversion-focused landing page for adults in the **United States**
who are unhappy with a previous rhinoplasty and are researching a **revision
(secondary) rhinoplasty** with Dr. Celal Alioglu in Istanbul.

It was rebuilt as a **direct copy of the practice group's Dr Atıf face-UK Astro
template** ("birebir" structure — same components, section order, design tokens and
sizing). Verified Dr. Celal facts (surgeon, credentials, hospital, package, clinical
timings, contact, reviews, video testimonials, before/after images) were ported from
the clinic's own **Dr. Celal AU rhinoplasty page** and localized to US English +
reframed around the revision angle. This build intentionally does **not** include the
extra revision-specific sections of an earlier version.

Deployed subpath: `/us/revision-rhinoplasty-in-turkey/` on `lp.celalalioglu.com`.

## Commands

```bash
npm install    # first run only
npm run dev
npm run build  # static build → dist/ (must pass before any handoff)
npm run preview
```

Node `>=22.12.0`. **A successful production build is mandatory after any change.**

## Architecture

- Astro 7 static output with React 19 islands.
- `src/data/content.ts` is the single source of truth for every visible string.
  `reviews.ts`, `faq.ts`, `beforeAfter.ts`, `videoTestimonials.ts` only re-export
  slices of it — never create a second copy source.
- Public asset paths resolve through `src/data/asset.ts` so they stay correct under
  the deployed base path. Don't hard-code `/images/...`.
- `src/pages/index.astro` owns section order and island hydration.
- `src/layouts/Layout.astro` owns metadata, canonical, robots and JSON-LD
  (Physician + FAQPage).
- `src/styles/global.css` owns the design-system tokens.

## Section order (birebir Dr Atıf)

Header → Hero → Surgeon → **Before & After** → Video stories → Reviews → Procedures
→ Package (CarePackage) → Consultation form → Amenities → Patient journey → FAQ →
Mobile form → Footer → WhatsApp FAB → Mobile CTA bar → Consultation modal.

`SocialProofBar.astro` and `ClinicGallery.tsx` exist but are **not rendered**
(`content.socialProof` / `content.clinicGallery` are unused).

## Design system

Currently the inherited Dr Atıf **editorial-luxury** system in `global.css`: canvas
cream `#faf7f2`, ink `#26231f`, accent **champagne `#b6925f`**. Headings Playfair
Display, body Inter (Astro Fonts API, local woff2). A palette/font **re-tune for this
audience is an open option** — change only `:root` tokens in `global.css` (+ font
definitions in `astro.config.mjs`); layout/spacing stay fixed.

## Content rules

- **US English** (en-US): "anesthesia", "center", "organized", "traveled".
- Never invent ratings, statistics, memberships, safety claims, recovery figures or
  prices. Verified facts come from the AU rhinoplasty page; anything unverified is TODO.
- Patient reviews are reproduced **verbatim**. Only rhinoplasty / procedure-neutral
  reviews are shown (the clinic's other verified reviews describe face/neck procedures
  and were intentionally excluded from a rhinoplasty page). Confirm consent before launch.
- Honest register: this audience has been oversold once. State caveats; avoid urgency,
  guarantees, and "risk-free" wording.
- **No on-page price.** The package section (`CarePackage`) is a qualitative
  Türkiye-vs-US comparison; pricing is shared on consultation. If a price is ever
  shown, confirm the figure with the clinic first.
- Images are client-managed. Don't replace, recrop, reorder or delete them unless asked.

## Functional invariants

- Astro base: `/us/revision-rhinoplasty-in-turkey`
- Form attribution (`ConsultationForm.tsx`): `page_variant: 'us-revision-rhinoplasty'`,
  `language: 'en-US'`, `procedure: 'revision-rhinoplasty'`
- WhatsApp number in `src/data/constants.ts` (`905324213936`)
- Webhook from `PUBLIC_MAKE_WEBHOOK_URL` in `.env` — never hard-coded. With no webhook,
  the form simulates success and logs to the console.
- **No GTM / analytics on-page yet** (Dr Atıf's container was removed). Add Dr. Celal's
  own container before launch.
- `Layout.astro` sets `robots: noindex`. Flip to index only when the clinic approves copy.

## Launch-gating TODOs

Make.com webhook scenario · flip noindex → index · add GTM/Ads container · confirm
review consent + source revision-specific reviews · written consent for before/after
images · real 1200×630 OG image (`celal-og.webp` is a placeholder) · real favicon
(placeholder) · verify EBOPRAS/ISAPS/ASPS current · privacy-policy page linked from the
form consent · final mobile + desktop + Lighthouse pass.

## Editing and verification

After any change: run `npm run build`, then check the rendered page for stale copy,
broken images, brand leaks (no "atif"/"cezair"), and correct form attribution +
WhatsApp values. Do not commit or push unless asked.
