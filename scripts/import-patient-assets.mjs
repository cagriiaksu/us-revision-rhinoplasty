// One-off importer: converts the real patient lifestyle portraits + branded
// video-testimonial thumbnails (PNG) into optimised WebP for the landing page.
//
//   node scripts/import-patient-assets.mjs
//
// Sources live outside the repo (client Kreatifler folder); outputs land in
// public/images/ as atif-result-NN.webp and atif-vt-0N.webp.

import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { statSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'public', 'images');

const SRC_BA = 'C:/Users/cagri/OneDrive/Masaüstü/Dr Atıf Cezairlioglu/Kreatifler/Görseller/before-after';
const SRC_TH = 'C:/Users/cagri/OneDrive/Masaüstü/Dr Atıf Cezairlioglu/Kreatifler/Görseller/thumbnails';

// Display order for the "Patient results" gallery — interleave named patients
// with the numbered shots for variety; lead with the dressier glam portraits.
const PORTRAITS = [
  'Dani Imbert.png',            // 01
  '10.png',                     // 02
  'Lucinda Joy Ashworth.png',   // 03
  '11.png',                     // 04
  'chloe saxon.png',            // 05
  '12.png',                     // 06
  '13.png',                     // 07
  'Dani Imbert (3).png',        // 08
  '14.png',                     // 09
  'Lucinda Joy Ashworth (2).png', // 10
  '15.png',                     // 11
  'chloe saxon (2).png',        // 12
  '16.png',                     // 13
  'Dani Imbert (2).png',        // 14
  '17.png',                     // 15
  'Lucinda Joy Ashworth (3).png', // 16
  'chloe saxon (3).png',        // 17
];

const THUMBS = [
  '1.png', // atif-vt-01 — Dani Imbert (denim)
  '2.png', // atif-vt-02 — Dani Imbert (red)
  '3.png', // atif-vt-03 — Lucinda Joy Ashworth
];

const kb = (p) => Math.round(statSync(p).size / 1024);
const pad = (n) => String(n).padStart(2, '0');

async function convert(srcPath, outName, width, quality) {
  const meta = await sharp(srcPath).metadata();
  const outPath = join(OUT, outName);
  await sharp(srcPath)
    .rotate() // honour EXIF orientation
    .resize({ width, withoutEnlargement: true })
    .webp({ quality })
    .toFile(outPath);
  console.log(
    `${outName.padEnd(24)}  src ${meta.width}x${meta.height} ` +
      `(${kb(srcPath)}KB) -> ${kb(outPath)}KB`,
  );
}

console.log('── Patient result portraits ───────────────');
for (let i = 0; i < PORTRAITS.length; i++) {
  await convert(join(SRC_BA, PORTRAITS[i]), `atif-result-${pad(i + 1)}.webp`, 1000, 78);
}

console.log('\n── Video testimonial thumbnails ───────────');
for (let i = 0; i < THUMBS.length; i++) {
  await convert(join(SRC_TH, THUMBS[i]), `atif-vt-${pad(i + 1)}.webp`, 700, 82);
}

console.log('\nDone.');
