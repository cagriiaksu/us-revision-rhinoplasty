// All visible strings for the Dr. Celal Alioglu US revision-rhinoplasty LP.
// Single source of truth — components import from here, never hardcode text.
//
// ⚠️ DEMO DRAFT: local, noindex, client-review build. Verified facts (surgeon,
// credentials, hospital, package, clinical timings, contact) are sourced from the
// clinic's own Dr. Celal AU rhinoplasty page. Patient REVIEWS are reproduced
// verbatim. US English (en-US). Anything marked TODO must be confirmed with the
// clinic (and consent verified) before launch. No public price is shown on-page
// (pricing is shared on consultation) — matching the source template.
//
// Public asset paths are wrapped in asset() so they resolve under the site base
// (/us/revision-rhinoplasty-in-turkey/) when deployed. See src/data/asset.ts.
import { asset } from './asset';

// ─── Types ────────────────────────────────────────────────────────
export interface FAQItem {
  question: string;
  answer: string;
}

export interface Review {
  name: string;
  location?: string;
  rating: number;
  text: string;
}

export interface PatientCase {
  image: string;
  alt: string;
  caption: string;
  location: string;
  timeframe: string;
  profession?: string;
  instagram?: string;
}

export interface VideoTestimonial {
  youtubeId: string;
  patientName: string;
  location: string;
  procedure: string;
  thumbnail: string;
}

// ─── Content ──────────────────────────────────────────────────────
export const content = {
  // ─── Meta / SEO ──────────────────────────────────────────────────
  meta: {
    title:
      "Revision Rhinoplasty in Turkey | Dr. Celal Alioglu — Secondary Rhinoplasty Specialist",
    description:
      "Revision (secondary) rhinoplasty in Istanbul with European Board–certified surgeon Dr. Celal Alioglu. For patients unhappy with a previous nose surgery — breathing, asymmetry and aesthetic concerns. All-inclusive care and a free video consultation.",
  },

  // ─── Header ──────────────────────────────────────────────────────
  header: {
    logoAlt: "Dr. Celal Alioglu",
    // One list drives both breakpoints, in page order. `mobileOnly` items are
    // dropped from the desktop bar, which is deliberately down to four: the
    // header there sits on the hero's clean cream and a six-link bar crowded it.
    // The slide-in panel has room, so it keeps the full set.
    navLinks: [
      { href: "#surgeon", label: "Dr. Celal" },
      { href: "#before-after", label: "Before & After" },
      { href: "#video-testimonials", label: "Testimonials" },
      { href: "#reviews", label: "Reviews", mobileOnly: true },
      { href: "#procedures", label: "Procedures", mobileOnly: true },
      { href: "#packages", label: "Package" },
      { href: "#faq", label: "FAQ", mobileOnly: true },
    ],
    ctaButton: "Book a consultation",
  },

  // ─── Hero ────────────────────────────────────────────────────────
  // Two approved designs, one per breakpoint (desktop 9A / mobile 6A), so the
  // headline and the trust checklist deliberately differ by breakpoint. Only
  // one of each pair is ever displayed — see Hero.astro.
  hero: {
    // Desktop only: the eyebrow carries the "Revision rhinoplasty in Turkey"
    // keyword. Mobile leads with the H1 alone.
    eyebrow: "Revision rhinoplasty in Turkey",
    headlineDesktop: "Expert Revision Rhinoplasty",
    headlineMobile: "Expert Revision Rhinoplasty",
    // Shared gold serif line under either headline.
    headlineAccent: "with Dr Celal Alioglu",
    // One approved checklist, shown at both breakpoints. The years figure is
    // 10+ everywhere on the site — see the surgeon bio.
    featuresDesktop: [
      "Half of his rhinoplasties are revisions from other surgeons",
      "American Society of Plastic Surgeons member",
      "Every procedure is performed personally by Dr Celal",
      "10+ years focused on facial aesthetics",
    ],
    featuresMobile: [
      "Half of his rhinoplasties are revisions from other surgeons",
      "American Society of Plastic Surgeons member",
      "Every procedure is performed personally by Dr Celal",
      "10+ years focused on facial aesthetics",
    ],
    ctaButton: "Book a free consultation",
    // Word appended to each rating's `count` in the hero trust bar.
    reviewsLabel: "reviews",
    // Verified with the clinic (Aug 2026). All fields render, in the desktop
    // trust bar that straddles the hero slab's bottom edge; mobile carries no
    // rating claim in the hero.
    //
    // `logo` points at a trimmed, resized derivative of the brand asset the
    // clinic supplied (originals kept alongside, untouched): cropped to its ink
    // box so one CSS height renders all three at the same optical size, and
    // resampled to 60px tall = 3x the 20px render height. `logoW`/`logoH` are
    // the derivative's intrinsic pixels, set on the <img> so it reserves its
    // space and cannot shift the bar as it decodes.
    //
    // `markOnly` flags a logo that carries no wordmark — Google supplied only
    // the "G", so that cell pairs the mark with the platform name in text while
    // the other two lockups already name themselves.
    ratings: [
      {
        platform: "Google",
        score: "4.9",
        count: "252+",
        logo: "/images/review-google.webp",
        logoW: 59,
        logoH: 60,
        markOnly: true,
        // Stable CID permalink — the Google local-search deep link the clinic
        // sent carries session parameters that expire.
        url: "https://www.google.com/maps?cid=1119166339849112276",
      },
      {
        platform: "Trustpilot",
        score: "4.9",
        count: "106",
        logo: "/images/review-trustpilot.webp",
        logoW: 244,
        logoH: 60,
        markOnly: false,
        url: "https://www.trustpilot.com/review/celalalioglu.com",
      },
      {
        platform: "RealSelf",
        score: "5.0",
        count: "70",
        logo: "/images/review-realself.webp",
        logoW: 267,
        logoH: 60,
        markOnly: false,
        url: "https://www.realself.com/dr/celal-alioglu-istanbul-turkey#reviews",
      },
    ],
    imageAlt:
      "Dr. Celal Alioglu, revision rhinoplasty surgeon, in his Istanbul clinic",
  },

  // ─── Social Proof Bar (qualitative — NO fabricated ratings; unused) ──
  socialProof: {
    points: [
      { title: "Dedicated 24/7 English-speaking support" },
      { title: "Private video consultation" },
      { title: "JCI-accredited Istanbul hospital" },
      { title: "Long-term follow-up after you travel home" },
    ],
  },

  // ─── Surgeon Bio ─────────────────────────────────────────────────
  surgeonBio: {
    eyebrow: "Meet your surgeon",
    name: "Dr. Celal Alioglu",
    title: "Board-Certified Plastic Surgeon & Aesthetics Specialist",
    bio: [
      "Dr. Celal Alioglu has been performing rhinoplasty for over 10 years. About half of his practice today is secondary rhinoplasty: patients who had their first surgery with another surgeon and came to him to have it corrected.",
      "He consults and examines patients himself at his practice on Bağdat Caddesi in Suadiye, Istanbul, and operates at Medicana Kadıköy, a JCI-accredited hospital.",
    ],
    quote:
      "“The best result never looks like it was fixed. It looks like it was always there.”",
    ctaButton: "Book a free consultation",
    imageAlt: "Dr. Celal Alioglu, board-certified plastic surgeon, in his Istanbul clinic",
    credentialsTitle: "Certifications & accreditations",
    // Verified memberships/certification (source: clinic's own AU rhinoplasty page).
    // ASPS leads: it is the body a US reader recognizes on sight, so it carries
    // more trust here than EBOPRAS. Rendered in array order by SurgeonBio.astro.
    credentials: [
      { abbr: "ASPS", name: "American Society of Plastic Surgeons", logo: asset("/images/asps-logo.webp") },
      { abbr: "European Board", name: "European Board of Plastic, Reconstructive & Aesthetic Surgery", logo: asset("/images/ebopras.webp") },
      { abbr: "ISAPS", name: "International Society of Aesthetic Plastic Surgery", logo: asset("/images/isaps-logo.webp") },
    ],
  },

  // ─── Patient Results Gallery (rhinoplasty before/after) ──────────
  // Current result set supplied by the clinic: 8 side-by-side before|after
  // composites at 1800 × 1600 (9:8), converted from public/before afterlar/N.png.
  // These replaced the 10 images ported from the AU page — do not reuse those.
  // Card geometry matches 9:8 exactly, so nothing is cropped; see
  // .ba-image-wrapper in BeforeAfterGallery.tsx.
  // TODO before launch: confirm written patient consent for each case.
  beforeAfter: {
    eyebrow: "Patient results",
    sectionTitle: "Before & after",
    sectionSubtitle:
      "A selection of rhinoplasty results from patients who chose Dr. Celal Alioglu.",
    demoNote: "",
    labelBefore: "Before",
    labelAfter: "After",
    ctaButton: "Request more results",
    postOpLabel: "",
    cases: [
      { image: asset("/images/celal-ba-01.webp"), alt: "Rhinoplasty before and after — patient of Dr. Celal Alioglu", caption: "", location: "", timeframe: "" },
      { image: asset("/images/celal-ba-02.webp"), alt: "Rhinoplasty before and after — patient of Dr. Celal Alioglu", caption: "", location: "", timeframe: "" },
      { image: asset("/images/celal-ba-03.webp"), alt: "Rhinoplasty before and after — patient of Dr. Celal Alioglu", caption: "", location: "", timeframe: "" },
      { image: asset("/images/celal-ba-04.webp"), alt: "Rhinoplasty before and after — patient of Dr. Celal Alioglu", caption: "", location: "", timeframe: "" },
      { image: asset("/images/celal-ba-05.webp"), alt: "Rhinoplasty before and after — patient of Dr. Celal Alioglu", caption: "", location: "", timeframe: "" },
      { image: asset("/images/celal-ba-06.webp"), alt: "Rhinoplasty before and after — patient of Dr. Celal Alioglu", caption: "", location: "", timeframe: "" },
      { image: asset("/images/celal-ba-07.webp"), alt: "Rhinoplasty before and after — patient of Dr. Celal Alioglu", caption: "", location: "", timeframe: "" },
      { image: asset("/images/celal-ba-08.webp"), alt: "Rhinoplasty before and after — patient of Dr. Celal Alioglu", caption: "", location: "", timeframe: "" },
    ] as PatientCase[],
  },

  // ─── Video Testimonials ──────────────────────────────────────────
  // Verified patient shorts (real YouTube IDs, ported from the AU page). US
  // patient (Katherine) leads. brandedThumbnails: false → the card overlays name
  // + location. TODO: add US revision-rhinoplasty stories where available.
  videoTestimonials: {
    eyebrow: "In their words",
    sectionTitle: "Patient stories",
    sectionSubtitle:
      "Short, honest reflections on the experience — from first consultation to recovery.",
    brandedThumbnails: false,
    items: [
      { youtubeId: "e3gKOQ7buc0", patientName: "William", location: "Manchester, United Kingdom", procedure: "Patient story", thumbnail: asset("/images/vt-william.webp") },
      { youtubeId: "3acHAyTIdJ4", patientName: "Patrese", location: "Melbourne, Australia", procedure: "Patient story", thumbnail: asset("/images/vt-patrese.webp") },
      { youtubeId: "IZ1ODHzu77Y", patientName: "Gjyljeta", location: "Bern, Switzerland", procedure: "Patient story", thumbnail: asset("/images/vt-gjyljeta.webp") },
      { youtubeId: "cNuPTZ6C5ow", patientName: "Katherine", location: "Oregon, USA", procedure: "Patient story", thumbnail: asset("/images/vt-katherine.webp") },
      { youtubeId: "V3VNGiSTz4A", patientName: "Alison", location: "Melbourne, Australia", procedure: "Patient story", thumbnail: asset("/images/vt-alison.webp") },
      { youtubeId: "Q_ABNUDxO_c", patientName: "Phoebe", location: "Melbourne, Australia", procedure: "Patient story", thumbnail: asset("/images/vt-phoebe.webp") },
      { youtubeId: "31mECbO_Q2c", patientName: "Haley", location: "Melbourne, Australia", procedure: "Patient story", thumbnail: asset("/images/vt-haley.webp") },
      { youtubeId: "mlAA3OKQ_U4", patientName: "Logan", location: "Sydney, Australia", procedure: "Patient story", thumbnail: asset("/images/vt-logan.webp") },
    ] as VideoTestimonial[],
  },

  // ─── Reviews Carousel ────────────────────────────────────────────
  // Curated subset of the verified review set ported from the clinic's own
  // Dr. Celal AU rhinoplasty page (`src/data/reviews.ts` there), plus "Billy Jean"
  // which only existed on this page. Text is reproduced as published, localized to
  // en-US spelling only ("travelled" → "traveled", "organised" → "organized"); no
  // wording, claims or ratings were changed. `location` is set only where the review
  // text itself states where the patient traveled from — never inferred.
  //
  // Curated for this page (Aug 2026): 24 → 9. Revision (secondary) rhinoplasty and
  // US patients lead; the rest are kept only where they answer a question this
  // audience actually has — surgeon selection after a bad first result, breathing
  // function, traveling from abroad, how the result holds up a year on, and going
  // in nervous. Cut: the source page's duplicate entries (the same patient listed
  // twice under two platforms — Hiimangelina = Angelina Stapley, Steph Ganowski =
  // StephanieGan77), reviews whose substance is another procedure (breast, eyelid),
  // and interchangeable one-line praise that added length without adding evidence.
  // The full 24-entry set is in git history at 74514af if any are ever needed back.
  // TODO before launch: confirm review consent with the clinic; source more
  // revision-specific and US reviews to replace the primary-rhinoplasty fallbacks.
  reviews: {
    eyebrow: "What patients say",
    sectionTitle: "Patient reviews",
    sectionSubtitle:
      "Verified reviews from patients who chose Dr. Celal Alioglu.",
    badge: "",
    readMore: "Read more",
    showLess: "Show less",
    ctaButton: "Start your journey",
    emptyText: "Patient reviews will appear here once published.",
    items: [
      // ── Revision (secondary) rhinoplasty and US patients — lead the carousel ──
      {
        name: "Katie",
        rating: 5,
        text: "I am five weeks post-op from revision rhinoplasty with Dr. Celal Alioglu and I couldn't be happier. My nose looks beautiful, my breathing is better, and the entire experience was smooth and well organized.",
      },
      {
        name: "Angelina Stapley",
        location: "United States",
        rating: 5,
        text: "My experience with Dr. Celal Alioglu was truly exceptional. I traveled from the United States for revision rhinoplasty and breast augmentation, and my nose is now straighter, more symmetrical, and much easier to breathe through.",
      },
      {
        name: "Katya Malashevich",
        rating: 5,
        text: "My rhinoplasty with Dr. Celal Alioglu was a life-changing experience. He listened carefully, explained what needed to be corrected, and delivered a natural-looking result that improved both my appearance and breathing.",
      },

      // ── Choosing a surgeon after a first result you regret ──
      {
        name: "Billy Jean",
        rating: 5,
        text: "Turkey is saturated with plastic surgeons. It can be confusing to select the right surgeon for your specific needs. I started my research a year ago, followed surgeons on social media and realself, checked their qualifications, flew to Turkey for consultations. All the hard work paid off because I found Dr Celal!! His attention to detail and natural results speak for themselves.",
      },
      {
        name: "EmzHeart",
        rating: 5,
        text: "I had rhinoplasty and upper blepharoplasty with Dr. Celal. I didn't want a completely different nose, only subtle corrections, and that is exactly what he delivered. The result looks natural and suits my face.",
      },
      {
        name: "Harris Ashraf",
        rating: 5,
        text: "Dr. Celal did a really good job with my rhinoplasty. I was nervous about the result, but he reassured me and delivered a natural result that was better than I expected.",
      },

      // ── Breathing function, traveling from abroad, and the result a year on ──
      {
        name: "Majid",
        rating: 5,
        text: "I recently had rhinoplasty with Dr. Celal Alioglu, and it was one of the best decisions I have ever made. The result is both aesthetic and functional, and my breathing has improved dramatically.",
      },
      {
        name: "Soner Oruc",
        location: "Sydney, Australia",
        rating: 5,
        text: "I traveled from Sydney, Australia to Istanbul for rhinoplasty with Dr. Celal. The hotel, transfers, consultation, and surgery were all well organized. My nose looks amazing, and I can breathe properly again.",
      },
      {
        name: "Natia Rasulova",
        rating: 5,
        text: "One year after my rhinoplasty with Dr. Celal, I am extremely happy with my result. My nose looks natural, suits my face, and I can breathe perfectly.",
      },
    ] as Review[],
  },

  // ─── Procedure Details (revision-led) ────────────────────────────
  procedures: {
    eyebrow: "Procedures",
    sectionTitle: "Your rhinoplasty options",
    sectionSubtitle:
      "Tailored to your face, your goals and your anatomy.",
    ctaButton: "Book a free consultation",
    items: [
      {
        title: "Revision Rhinoplasty",
        tab: "Revision",
        subtitle: "Secondary rhinoplasty",
        description:
          "Corrects breathing problems, asymmetry or aesthetic concerns left by an earlier rhinoplasty. Second operations are harder than first ones, and Dr. Celal regularly takes on cases referred from clinics in Europe, Australia and the Middle East.",
        info: [
          { label: "Operation time", value: "3–5 hours" },
          { label: "Return to work", value: "10–14 days" },
          { label: "Hospital stay", value: "1 night" },
          { label: "Anesthesia", value: "General" },
        ],
      },
      {
        title: "Piezo Rhinoplasty",
        tab: "Piezo",
        subtitle: "Ultrasonic precision technique",
        description:
          "Reshapes the nasal bones with ultrasonic vibrations rather than manual instruments, so the surrounding tissue stays intact. Most patients bruise less and recover sooner. Dr. Celal plans each case around your facial proportions and your breathing.",
        info: [
          { label: "Operation time", value: "2–3 hours" },
          { label: "Return to work", value: "7–10 days" },
          { label: "Hospital stay", value: "1 night" },
          { label: "Anesthesia", value: "General" },
        ],
      },
    ],
  },

  // ─── Package comparison (all-inclusive vs typical US route — NO pricing) ───
  packageCompare: {
    eyebrow: "Your package",
    sectionTitle: "Everything handled — one all-inclusive package",
    colOurs: "With Dr. Celal",
    colOursShort: "Dr. Celal",
    colUK: "US clinics",
    flagOursLabel: "Türkiye",
    flagUKLabel: "United States",
    rows: [
      { feature: "Surgery performed personally by Dr. Celal", ours: true, uk: false },
      { feature: "Surgery at a JCI-accredited hospital, incl. 1 night", ours: true, uk: true },
      { feature: "General anesthesia & all medication", ours: true, uk: true },
      { feature: "5-star hotel throughout your stay", ours: true, uk: false },
      { feature: "VIP airport, hospital & hotel transfers", ours: true, uk: false },
      { feature: "24/7 English-speaking coordinator (Yagmur)", ours: true, uk: false },
      { feature: "Long-term follow-up after you fly home", ours: true, uk: false },
    ],
    note: "In the US, these services are typically booked and paid for separately. With Dr. Celal, they are all included in a single package.",
    ctaButton: "Get a free quote",
  },

  // ─── Consultation Form ───────────────────────────────────────────
  form: {
    sectionTitle: "Book your free, private consultation",
    sectionSubtitle:
      "Share a few details and our team will be in touch. Confidential, no obligation.",
    minimalTitle: "Have a question? Let's talk",
    minimalCta: "Book a free consultation",
    infoTitle: "What to expect",
    benefits: [
      "A personal assessment of your options",
      "Clear, honest guidance",
      "No pressure, no obligation",
    ],
    privacyNote: "Your details are kept completely confidential.",
    labels: {
      fullName: "Full name *",
      email: "Email *",
      phone: "Phone *",
      message: "Message (optional)",
    },
    placeholders: {
      fullName: "Your full name",
      email: "your@email.com",
      message: "Tell us what you're considering…",
    },
    validation: {
      nameRequired: "Please enter your name",
      emailRequired: "Please enter your email",
      emailInvalid: "Please enter a valid email",
      phoneRequired: "Please enter your phone number",
      phoneInvalid: "Please enter a valid phone number",
    },
    // TODO (before launch): add a real Privacy Policy page and link it here.
    consent:
      "I agree to my personal details being used so the team can contact me about my enquiry.",
    submitButton: "Request my consultation",
    submitting: "Sending…",
    submitError:
      "We couldn't send your request. Please try again in a moment.",
    modalTitle: "Book a free consultation",
    modalSubtitle:
      "Leave your details and our team will be in touch shortly.",
    modalClose: "Close",
    success: {
      title: "Thank you",
      message:
        "Your request has been received. Our team will contact you shortly to arrange your private consultation.",
    },
  },

  // ─── Amenities ───────────────────────────────────────────────────
  amenities: {
    eyebrow: "Your experience",
    sectionTitle: "A calm, cared-for stay",
    sectionSubtitle:
      "The comforts that make traveling for surgery feel effortless.",
    ctaButton: "Book a consultation",
    items: [
      {
        title: "24/7 English support",
        description:
          "Your dedicated coordinator, Yagmur, provides round-the-clock support in English — from your first question to your journey home.",
        image: asset("/images/support.webp"),
        alt: "Your dedicated English-speaking patient coordinator",
      },
      {
        title: "JCI-accredited hospital",
        description:
          "Your rhinoplasty is performed at Medicana Hospital, an internationally accredited facility that meets rigorous standards for safety and quality.",
        image: asset("/images/hospital.webp"),
        alt: "Reception of an accredited private hospital in Istanbul",
      },
      {
        title: "VIP transfers",
        description:
          "Private door-to-door transfers between the airport, hospital and hotel — comfortable and stress-free.",
        image: asset("/images/vip-transfer.webp"),
        alt: "Private VIP transfer van in Istanbul",
      },
      {
        title: "5-star accommodation",
        description:
          "Recover in a comfortable partner hotel, breakfast included, chosen with international patients in mind.",
        image: asset("/images/hotel.webp"),
        alt: "Comfortable 5-star partner hotel room",
      },
    ],
  },

  // ─── Clinic / Media Gallery (currently disabled in index.astro) ──
  clinicGallery: {
    eyebrow: "Where it happens",
    sectionTitle: "The hospital, clinic & your stay",
    sectionSubtitle:
      "A look at where your journey takes place.",
    images: [
      { src: asset("/images/celal-ba-01.webp"), alt: "Rhinoplasty result — placeholder", label: "Results" },
      { src: asset("/images/celal-ba-02.webp"), alt: "Rhinoplasty result — placeholder", label: "Results" },
      { src: asset("/images/celal-ba-03.webp"), alt: "Rhinoplasty result — placeholder", label: "Results" },
      { src: asset("/images/celal-ba-04.webp"), alt: "Rhinoplasty result — placeholder", label: "Results" },
    ],
  },

  // ─── Patient Journey ─────────────────────────────────────────────
  patientJourney: {
    eyebrow: "How it works",
    sectionTitle: "Your journey, step by step",
    sectionSubtitle:
      "From first consultation to recovery back home — every step considered.",
    ctaButton: "Start your journey",
    steps: [
      {
        title: "Free video consultation",
        description:
          "Discuss your goals with Dr. Celal on a secure video call. He'll review your photos and talk honestly through what revision surgery can — and can't — achieve for you.",
      },
      {
        title: "Travel planning",
        description:
          "Book your flights — Yagmur arranges your accommodation, transfers and every local detail.",
      },
      {
        title: "Arrival & check-in",
        description:
          "Meet Yagmur at the airport, settle into your 5-star hotel and complete pre-operative checks the next day.",
      },
      {
        title: "Surgery day",
        description:
          "Dr. Celal personally performs your rhinoplasty at Medicana Hospital, with one night's hospital stay included.",
      },
      {
        title: "Recovery & cast removal",
        description:
          "Cast and stitches are typically removed around day 7, with daily check-ins from the team while you recover.",
      },
      {
        title: "Return home",
        description:
          "Most patients fly home around day 8–10 with detailed aftercare, and long-term follow-up with Dr. Celal whenever you need it.",
      },
    ],
  },

  // ─── FAQ ─────────────────────────────────────────────────────────
  faq: {
    eyebrow: "Good to know",
    sectionTitle: "Frequently asked questions",
    sectionSubtitle:
      "The questions US patients ask us most about revision rhinoplasty in Istanbul.",
    items: [
      {
        question: "Is it safe to have rhinoplasty surgery abroad?",
        answer:
          "Your surgery is performed at Medicana Hospital, a JCI-accredited hospital that meets recognized international standards for safety and quality. Dr. Celal Alioglu is a member of the American Society of Plastic Surgeons (ASPS) and ISAPS, and is European Board–certified (EBOPRAS), reflecting a high level of surgical training and professional recognition. Many patients from the United States and around the world have been cared for through a structured journey with support before, during and after travel.",
      },
      {
        question: "Why is revision rhinoplasty more complex than a first-time procedure?",
        answer:
          "Revision (secondary) rhinoplasty works with tissue and structure that have already been operated on, so it demands more planning and experience than a primary case. Dr. Celal addresses breathing issues, asymmetry and aesthetic concerns from prior procedures, and has corrected cases referred from clinics across Europe, Australia and the Middle East. On your consultation he'll be honest about what is realistic for your nose.",
      },
      {
        question: "What does the all-inclusive package include?",
        answer:
          "Just book your flights — we handle everything else. The package covers private VIP transfers between the airport, hotel and clinic throughout your stay, 5-star hotel accommodation with breakfast, all surgery, anesthesia and hospital fees (including 1 night), medications and post-op supplies, a 24/7 English-speaking coordinator (Yagmur), follow-up appointments, and long-term follow-up support after you return home. Pricing is shared clearly on your consultation — no public price is listed online.",
      },
      {
        question: "How long will I need to stay, and when can I fly home?",
        answer:
          "Many patients are typically cleared to fly home around 8–10 days after surgery, once the cast has been removed and healing is progressing well, following a final check-up with Dr. Celal Alioglu. You'll stay at a 5-star partner hotel during recovery, with 24/7 support from your English-speaking coordinator, Yagmur. A detailed recovery timeline is shared with you in advance so you can book flights with confidence.",
      },
      {
        question: "What happens if I have concerns once I'm back home?",
        answer:
          "You'll have long-term follow-up support with our team — there is no expiry on our care. If any concerns arise, whether weeks, months, or years after your procedure, Dr. Celal Alioglu will personally review your case by video call. In the rare event that a further revision is needed, we'll work with you to arrange your return.",
      },
      {
        question: "Can I combine revision rhinoplasty with other procedures?",
        answer:
          "Yes. Many patients combine rhinoplasty with septoplasty (deviated septum correction), turbinate reduction, chin augmentation, or a lip lift in the same session. Dr. Celal Alioglu will recommend the best combination for your goals during your free video consultation.",
      },
      {
        question: "Will Dr. Celal personally perform my surgery?",
        answer:
          "Yes — Dr. Celal Alioglu personally performs every procedure from start to finish. There are no assistant surgeons, no substitutes, and no handoffs during your operation. You'll meet him during your video consultation, again the day before surgery, and he'll be the surgeon in the operating room throughout.",
      },
    ] as FAQItem[],
  },

  // ─── Footer ──────────────────────────────────────────────────────
  footer: {
    tagline:
      "Revision and primary rhinoplasty in Istanbul with Dr. Celal Alioglu — ASPS & ISAPS member, European Board certified. Careful, natural-looking results and dedicated support for international patients.",
    contactTitle: "Get in touch",
    // Verified clinic contact details (source: clinic's own AU rhinoplasty page).
    contact: {
      address: "Suadiye, Bağdat Cad. No:411/8, 34740 Kadıköy/İstanbul",
      addressLink: "https://maps.app.goo.gl/KKLwFBVU2BpLY8yt7",
      phone: "+90 532 421 39 36",
      phoneLink: "tel:+905324213936",
      email: "info@celalalioglu.com",
      emailLink: "mailto:info@celalalioglu.com",
    },
    copyright:
      "© {year} Dr. Celal Alioglu. All rights reserved. Demo draft — not for publication.",
  },

  // ─── WhatsApp / Enquiry Button ───────────────────────────────────
  whatsapp: {
    ariaLabel: "Chat on WhatsApp",
    labelTitle: "Chat with Yagmur",
    labelSub: "Free, private & no obligation",
  },

  // ─── Mobile CTA Bar ─────────────────────────────────────────────
  mobileCta: {
    consultation: "Book a consultation",
    whatsapp: "WhatsApp",
    whatsappAria: "Message us on WhatsApp",
  },
};
