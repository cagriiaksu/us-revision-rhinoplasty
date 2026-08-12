// Hero asset generator for the Dr Celal Alioglu US revision-rhinoplasty LP.
//
// Converts the two client-supplied hero masters into the WebP derivatives the
// hero actually serves (desktop 9A slab + mobile 6A photo band):
//
//   hero-portrait-2000.png  2000x1800  ->  celal-hero-slab-2000.webp  (2000w)
//                                      ->  celal-hero-slab-1600.webp  (1600w)
//   hero-1.png               600x645   ->  celal-hero-band-600.webp    (600w)
//
// The slab is the desktop LCP image and fills a ~580px CSS column, so the two
// widths cover 1x and 2x displays via srcset. The band is the mobile LCP image
// and renders full-bleed at 300px tall; 600w is the master's native width, so it
// is emitted 1:1 with no upscale.
//
// Run:  node scripts/gen-hero-assets.mjs
// Reads: source-images/hero/  (falls back to public/images/ where the client
//        dropped the masters this round)
// Output: public/images/
//
// Mirrors scripts/import-patient-assets.mjs (sharp, rotate, webp) so the new
// files match the rest of public/images.

import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { existsSync, statSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT = join(ROOT, 'public', 'images');
const MASTERS = [join(ROOT, 'source-images', 'hero'), OUT];

// Masters may live in either location depending on whether they have already
// been tidied out of public/ — resolve by name rather than hardcoding a folder.
function master(name) {
  for (const dir of MASTERS) {
    const p = join(dir, name);
    if (existsSync(p)) return p;
  }
  console.error(`  MISSING master: ${name} (looked in ${MASTERS.join(', ')})`);
  process.exit(1);
}

const kb = (p) => Math.round(statSync(p).size / 1024);

// [master, output, target width, quality]
const JOBS = [
  ['hero-portrait-2000.png', 'celal-hero-slab-2000.webp', 2000, 76],
  ['hero-portrait-2000.png', 'celal-hero-slab-1600.webp', 1600, 80],
  ['hero-1.png', 'celal-hero-band-600.webp', 600, 82],
];

console.log('── Hero assets ────────────────────────────');
for (const [src, outName, width, quality] of JOBS) {
  const srcPath = master(src);
  const outPath = join(OUT, outName);
  const meta = await sharp(srcPath).metadata();
  await sharp(srcPath)
    .rotate() // honour EXIF orientation
    .resize({ width, withoutEnlargement: true })
    .webp({ quality })
    .toFile(outPath);
  const out = await sharp(outPath).metadata();
  console.log(
    `${outName.padEnd(28)}  src ${meta.width}x${meta.height} ` +
      `(${kb(srcPath)}KB) -> ${out.width}x${out.height} ${kb(outPath)}KB`,
  );
}

console.log('\nDone.');
