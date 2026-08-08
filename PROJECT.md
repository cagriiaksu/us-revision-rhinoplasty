# Dr. Celal Alioglu — US Revision Rhinoplasty Landing Page

## Purpose

Conversion-focused single-page LP targeting **US adults unhappy with a prior
rhinoplasty**, researching a **revision (secondary) rhinoplasty** with Dr. Celal
Alioglu in Istanbul. Honest, evidence-driven tone — this audience has been oversold
once already, so every claim is paired with its caveat.

## How it was built

- **Structure & design:** a direct ("birebir") copy of the Dr Atıf **face-UK** Astro
  template — same components, section order, design tokens and sizing.
- **Verified content:** ported from the clinic's own **Dr. Celal AU rhinoplasty page**
  (surgeon bio, credentials, hospital, package inclusions, clinical timings, coordinator,
  contact, patient reviews, video testimonials, before/after images).
- **Localized** to US English and reframed around the revision/secondary angle.
  Procedures lead with **Revision Rhinoplasty**, then **Piezo Rhinoplasty**.

## Key facts (verified — from the AU source)

- **Surgeon:** Dr. Celal Alioglu — Board-Certified (EBOPRAS), ISAPS & ASPS member,
  15+ years in facial aesthetics, operates personally at **Medicana Hospital**, Istanbul.
- **Contact:** Suadiye, Bağdat Cad. No:411/8, 34740 Kadıköy/İstanbul ·
  +90 532 421 39 36 · info@celalalioglu.com · WhatsApp `905324213936`.
- **Package (all-inclusive):** surgery by Dr. Celal personally · JCI-accredited hospital
  incl. 1 night · general anesthesia + medication · 5-star hotel · VIP transfers ·
  24/7 English coordinator (Yagmur) · long-term follow-up. **No public price on-page.**
- **Timings:** Revision 3–5 h op / 10–14 days return to work / 1 night; Piezo 2–3 h /
  7–10 days / 1 night. Most patients fly home ~day 8–10 after cast removal.

## Tech

Astro 7 static + React 19 islands. Base `/us/revision-rhinoplasty-in-turkey`
(`vercel.json` rewrite). Deploy target Vercel. Node `>=22.12.0`. Form posts to
`PUBLIC_MAKE_WEBHOOK_URL` (Make.com) with `page_variant/language/procedure` attribution.

## Status: DEMO DRAFT (noindex)

Known placeholders / gaps to close before launch:
- `celal-og.webp` (Open Graph) and the favicon are placeholders.
- Reviews limited to 2 rhinoplasty / procedure-neutral entries (the clinic's other
  verified reviews describe face/neck procedures) — source revision-specific reviews.
- Some video testimonials are AU patients (one US) — add US revision stories where possible.
- Palette/fonts are still the inherited Dr Atıf champagne look — a re-tune is optional.

## Launch checklist

- [ ] Set up the page-specific Make.com scenario for `PUBLIC_MAKE_WEBHOOK_URL`
- [ ] Flip `robots` noindex → index in `Layout.astro` (after copy approval)
- [ ] Add the Dr. Celal GTM / Google Ads container
- [ ] Confirm patient-review consent + add revision-rhinoplasty-specific reviews
- [ ] File written consent for the before/after images
- [ ] Produce a real 1200×630 OG image and a real favicon
- [ ] Verify EBOPRAS / ISAPS / ASPS memberships are current
- [ ] Publish a privacy-policy page and link it from the form consent
- [ ] Final mobile + desktop review and Lighthouse pass
