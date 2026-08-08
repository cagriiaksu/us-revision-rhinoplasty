// Favicon generator for the Dr Atif Cezairlioglu LP.
// Crops the "AC" monogram out of the real brand logo and renders a brand
// favicon set (charcoal rounded tile + warm-ivory monogram).
//
// Run:  node scripts/gen-favicon.mjs
// Output: public/favicon.ico, public/favicon.svg, public/apple-touch-icon.png,
//         public/favicon-32.png, public/favicon-16.png
//
// Uses the WHITE logo source (white monogram on transparent) so it can be
// tinted to ivory and placed on the dark tile.

import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { writeFileSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PUB = join(ROOT, 'public');
const LOGO_SRC = '/Users/cagriaksu/Desktop/Dr Atıf/Kreatifler/reklam/logo/dr-atif-cezairlioglu-logo-white.png';

// ── Brand tokens ──
const TILE = '#26231f';   // --ink charcoal
const MONO = '#f3ead9';   // warm ivory
const RADIUS_RATIO = 0.22; // rounded-corner radius as fraction of tile size
const MONO_SCALE = 0.66;   // monogram box as fraction of tile

// 1) Extract the tight "AC" monogram from the white logo.
async function extractMonogram() {
  const { data, info } = await sharp(LOGO_SRC).trim({ threshold: 12 })
    .toBuffer({ resolveWithObject: true });
  // Crop the left region (before the vertical divider ~1362px) then trim tight.
  const leftW = Math.round(info.width * 0.2174); // ~1300 of 5980
  const { data: mono, info: mInfo } = await sharp(data)
    .extract({ left: 0, top: 0, width: leftW, height: info.height })
    .trim({ threshold: 12 })
    .toBuffer({ resolveWithObject: true });
  return { mono, w: mInfo.width, h: mInfo.height };
}

// 2) Render one square icon PNG at the given size.
async function renderTile(size, monoBuf, monoW, monoH) {
  const r = Math.round(size * RADIUS_RATIO);
  const tileSvg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">` +
    `<rect width="${size}" height="${size}" rx="${r}" ry="${r}" fill="${TILE}"/></svg>`
  );

  // Fit monogram into MONO_SCALE box, preserving aspect ratio.
  const box = Math.round(size * MONO_SCALE);
  const scale = Math.min(box / monoW, box / monoH);
  const mw = Math.max(1, Math.round(monoW * scale));
  const mh = Math.max(1, Math.round(monoH * scale));
  const mono = await sharp(monoBuf)
    .resize(mw, mh, { fit: 'fill' })
    .tint(MONO)                       // white monogram → warm ivory
    .png()
    .toBuffer();

  const left = Math.round((size - mw) / 2);
  const top = Math.round((size - mh) / 2);
  return sharp(tileSvg)
    .composite([{ input: mono, left, top }])
    .png()
    .toBuffer();
}

// 3) Assemble a multi-size .ico from PNG buffers (PNG-compressed entries).
function buildIco(entries) {
  const count = entries.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);      // reserved
  header.writeUInt16LE(1, 2);      // type: icon
  header.writeUInt16LE(count, 4);  // image count

  const dir = Buffer.alloc(16 * count);
  let offset = 6 + 16 * count;
  entries.forEach((e, i) => {
    const b = i * 16;
    dir.writeUInt8(e.size >= 256 ? 0 : e.size, b + 0);
    dir.writeUInt8(e.size >= 256 ? 0 : e.size, b + 1);
    dir.writeUInt8(0, b + 2);      // color palette
    dir.writeUInt8(0, b + 3);      // reserved
    dir.writeUInt16LE(1, b + 4);   // color planes
    dir.writeUInt16LE(32, b + 6);  // bits per pixel
    dir.writeUInt32LE(e.png.length, b + 8);
    dir.writeUInt32LE(offset, b + 12);
    offset += e.png.length;
  });

  return Buffer.concat([header, dir, ...entries.map((e) => e.png)]);
}

async function main() {
  const { mono, w, h } = await extractMonogram();
  console.log(`  monogram ${w}x${h}`);

  const sizes = [16, 32, 48, 180, 512];
  const png = {};
  for (const s of sizes) png[s] = await renderTile(s, mono, w, h);

  // ICO (16/32/48)
  const ico = buildIco([16, 32, 48].map((s) => ({ size: s, png: png[s] })));
  writeFileSync(join(PUB, 'favicon.ico'), ico);
  console.log('  favicon.ico (16/32/48)');

  // PNGs
  writeFileSync(join(PUB, 'favicon-16.png'), png[16]);
  writeFileSync(join(PUB, 'favicon-32.png'), png[32]);
  writeFileSync(join(PUB, 'apple-touch-icon.png'), png[180]);
  console.log('  favicon-16.png, favicon-32.png, apple-touch-icon.png');

  // SVG (self-contained: charcoal rounded tile + embedded 512 monogram render)
  const b64 = png[512].toString('base64');
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">` +
    `<image width="512" height="512" href="data:image/png;base64,${b64}"/></svg>`;
  writeFileSync(join(PUB, 'favicon.svg'), svg);
  console.log('  favicon.svg');
}

main();
