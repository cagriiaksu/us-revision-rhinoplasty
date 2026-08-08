// One-off demo asset generator for the Dr Atif UK facial-surgery LP draft.
// - Converts the real Dr Atif logos (dark/white) to WebP.
// - Generates tasteful, clearly-marked DEMO placeholder images for every
//   section that lacks a real photo (surgeon, hero, before/after, clinic,
//   amenities, video thumbnails, OG image).
//
// Run:  node scripts/gen-demo-assets.mjs
// Output: public/images/
//
// NOTE: All generated placeholders are DEMO ONLY. Replace before launch with
// real, consented, ASA/CAP-compliant photography.

import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT = join(ROOT, 'public', 'images');
const LOGO_SRC = '/Users/cagriaksu/Desktop/Dr Atıf/Kreatifler/reklam/logo';

// ── On-brand palette (editorial ivory / charcoal / champagne) ──
const TONES = [
  { bg: '#F4EEE7', accent: '#C7A87C', ink: '#3A352F' }, // ivory
  { bg: '#EFE7DD', accent: '#C9A66B', ink: '#332E28' }, // champagne sand
  { bg: '#F1E9E6', accent: '#CDA9A1', ink: '#3A3330' }, // soft rose
  { bg: '#EDE9E3', accent: '#B9A98C', ink: '#322E29' }, // warm stone
];

function placeholderSVG(w, h, label, tone) {
  const t = TONES[tone % TONES.length];
  const titleSize = Math.round(Math.min(w, h) * 0.072);
  const tagSize = Math.round(Math.min(w, h) * 0.034);
  const inset = Math.round(Math.min(w, h) * 0.05);
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="${t.bg}"/>
  <rect x="${inset}" y="${inset}" width="${w - inset * 2}" height="${h - inset * 2}" fill="none" stroke="${t.accent}" stroke-width="1.25" opacity="0.55"/>
  <circle cx="${w / 2}" cy="${h * 0.4}" r="${Math.min(w, h) * 0.07}" fill="none" stroke="${t.accent}" stroke-width="1.5" opacity="0.7"/>
  <text x="50%" y="${h * 0.56}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="${titleSize}" fill="${t.ink}">${label}</text>
  <text x="50%" y="${h * 0.56 + titleSize * 1.4}" text-anchor="middle" font-family="Georgia, serif" font-size="${tagSize}" letter-spacing="${tagSize * 0.18}" fill="${t.accent}">DEMO PLACEHOLDER</text>
</svg>`);
}

async function makePlaceholder(name, w, h, label, tone = 0) {
  await sharp(placeholderSVG(w, h, label, tone))
    .webp({ quality: 82 })
    .toFile(join(OUT, name));
  console.log('  placeholder', name, `${w}x${h}`);
}

async function convertLogo(src, name) {
  // Trim the heavy transparent/white padding around the wordmark so it renders
  // at a sensible size, then standardise the width.
  await sharp(join(LOGO_SRC, src))
    .trim({ threshold: 12 })
    .resize({ width: 760, withoutEnlargement: true })
    .webp({ quality: 92, alphaQuality: 100 })
    .toFile(join(OUT, name));
  console.log('  logo', name);
}

async function run() {
  console.log('Logos →');
  await convertLogo('dr-atif-cezairlioglu-logo-dark.png', 'atif-logo-dark.webp');
  await convertLogo('dr-atif-cezairlioglu-logo-white.png', 'atif-logo-white.webp');

  console.log('Hero + surgeon →');
  await makePlaceholder('atif-hero.webp', 1280, 1600, 'Editorial hero', 0);
  await makePlaceholder('atif-hero-mobile.webp', 720, 900, 'Editorial hero', 0);
  await makePlaceholder('atif-surgeon.webp', 1000, 1250, 'Dr Atif — portrait', 3);
  await makePlaceholder('atif-og.webp', 1200, 630, 'Dr Atif Cezairlioglu', 1);

  console.log('Before / after (6) →');
  for (let i = 1; i <= 6; i++) {
    await makePlaceholder(`atif-before-after-0${i}.webp`, 900, 1120, 'Before / After', i % 4);
  }

  console.log('Clinic gallery (8) →');
  const clinic = ['Hospital', 'Hospital', 'Patient suite', 'Hotel', 'Hotel', 'Clinic', 'Clinic', 'Consultation'];
  for (let i = 0; i < 8; i++) {
    await makePlaceholder(`atif-clinic-0${i + 1}.webp`, 1000, 760, clinic[i], i);
  }

  console.log('Amenities (4) →');
  await makePlaceholder('atif-amenity-support.webp', 900, 680, 'Patient support', 2);
  await makePlaceholder('atif-amenity-hospital.webp', 900, 680, 'Private hospital', 0);
  await makePlaceholder('atif-amenity-transfer.webp', 900, 680, 'VIP transfers', 1);
  await makePlaceholder('atif-amenity-hotel.webp', 900, 680, 'Recovery stay', 3);

  console.log('Video thumbnails (5, vertical) →');
  for (let i = 1; i <= 5; i++) {
    await makePlaceholder(`atif-vt-0${i}.webp`, 600, 1066, 'Patient story', (i + 1) % 4);
  }

  console.log('Done.');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
