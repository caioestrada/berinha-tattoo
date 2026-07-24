// One-off script to generate branded PWA icons. Not part of the app build.
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..', 'public', 'icons');
mkdirSync(outDir, { recursive: true });

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

const svg = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#0c0b09"/>
  <text x="256" y="266" text-anchor="middle" dominant-baseline="central" font-family="Georgia, 'Times New Roman', serif" font-weight="700" font-size="320" fill="#c9a464">B</text>
</svg>`;

for (const size of sizes) {
  const buffer = Buffer.from(svg(size));
  await sharp(buffer, { density: 384 })
    .resize(size, size)
    .png()
    .toFile(join(outDir, `icon-${size}x${size}.png`));
  console.log(`generated icon-${size}x${size}.png`);
}
