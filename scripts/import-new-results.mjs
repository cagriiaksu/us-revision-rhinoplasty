// One-off importer: converts the 7 newly supplied patient lifestyle portraits
// (dropped into public/images/<...eklenen...>/) into optimised WebP, appended to
// the "Patient results" gallery as atif-result-18..24.webp.
//
//   node scripts/import-new-results.mjs
//
// Mirrors scripts/import-patient-assets.mjs (sharp, rotate, width 1000, q78) so the
// new images match the existing atif-result-01..17 set exactly.

import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { readdirSync, statSync, existsSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const IMAGES = join(__dirname, '..', 'public', 'images');

// Resolve the source folder dynamically — its name ends with a trailing space, so
// match by pattern instead of hardcoding it.
const srcDirName = readdirSync(IMAGES).find(
  (n) => /eklenen/i.test(n) && statSync(join(IMAGES, n)).isDirectory(),
);
if (!srcDirName) {
  console.error('Source folder (…eklenen…) not found in public/images/');
  process.exit(1);
}
const SRC = join(IMAGES, srcDirName);
console.log(`Source: ${srcDirName}\n`);

// Ordered: UK cards first (18-21), then Bulgaria (22), then Poland (23-24).
const MAP = [
  ['Alexi-influencer-model-uk-@alexisbaileey.jpg', 18],
  ['Jo-Elizabeth-Influencer-uk-@jo_elizabeth_campbell.jpg', 19],
  ['Jemini-dancer-uk-@jemini.elizabeth.jpg', 20],
  ['Polly-makeup-artist-uk-@polly_pocket_t.jpg', 21],
  ['Dany-realestate-bulgaria-@danikostadinova.jpg', 22],
  ['paulina-aesthetian-poland-@aniolkowskaceglarz_aesthtetic.jpg', 23],
  ['paulina aesthetian-poland-@aniolkowskaceglarz_aesthtetic-2.jpg', 24],
];

const kb = (p) => Math.round(statSync(p).size / 1024);
const pad = (n) => String(n).padStart(2, '0');

console.log('── New patient result portraits ───────────');
for (const [file, idx] of MAP) {
  const srcPath = join(SRC, file);
  if (!existsSync(srcPath)) {
    console.error(`  MISSING: ${file}`);
    process.exit(1);
  }
  const outName = `atif-result-${pad(idx)}.webp`;
  const outPath = join(IMAGES, outName);
  const meta = await sharp(srcPath).metadata();
  await sharp(srcPath)
    .rotate() // honour EXIF orientation
    .resize({ width: 1000, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(outPath);
  console.log(
    `${outName.padEnd(22)}  src ${meta.width}x${meta.height} ` +
      `(${kb(srcPath)}KB) -> ${kb(outPath)}KB`,
  );
}

console.log('\nDone.');
