// Contact constants for the Dr Celal Alioglu US revision-rhinoplasty LP.
//
// WhatsApp is the primary direct channel for this audience. If the number is
// ever cleared, every "WhatsApp"/contact CTA falls back to opening the
// consultation modal instead of linking to wa.me.

// Dr Celal WhatsApp number (digits only, intl format — no '+').
export const WHATSAPP_NUMBER = '905324213936';

// While the number is empty we do NOT build a wa.me link. Components must treat
// an empty number as "open the consultation modal" rather than linking out.
export const HAS_WHATSAPP = WHATSAPP_NUMBER.length > 0;

// Prefilled message identifies the lead as a US revision-rhinoplasty enquiry
// (campaign attribution) and states the topic, in natural US English.
export const WHATSAPP_LINK = HAS_WHATSAPP
  ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      "Hi, I had a rhinoplasty before and I'm considering a revision with Dr. Celal. Could you send me more information, please?",
    )}`
  : '#consultation';
