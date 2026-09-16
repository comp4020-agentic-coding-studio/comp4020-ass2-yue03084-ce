/**
 * Generates the twelve lecture illustrations from `scripts/lecture-art/`.
 *
 * Each `week-XX.mjs` module exports `{ alt, draw(width, height) }`, built from
 * the shared two-ink kit in `scripts/lecture-art/palette.mjs` so the twelve
 * read as one series with the homepage hero and card (see
 * `scripts/make-images.mjs`). Unlike those two, these stay as plain `.svg`
 * files rather than rasters: each is a small, text-free-of-facts line
 * drawing, so there is no photographic detail for a raster codec to earn its
 * weight back on, and keeping them as SVG keeps every stroke exact at both
 * marking viewports.
 *
 * Committed rather than run once and forgotten, for the same reason as the
 * hero and card: the artwork is demonstrably the author's, and the drawing
 * code is the one place each week's geometry can be checked rather than
 * eyeballed.
 *
 * Run: node scripts/make-lecture-images.mjs
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./lecture-art/palette.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "images", "lectures");
const ART_DIR = join(ROOT, "scripts", "lecture-art");

const weeks = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));

await mkdir(OUT, { recursive: true });

const manifest = {};
for (const week of weeks) {
  const modulePath = join(ART_DIR, `week-${week}.mjs`);
  const { alt, draw } = await import(modulePath);
  const svg = draw(CANVAS_WIDTH, CANVAS_HEIGHT);
  const filename = `week-${week}.svg`;
  await writeFile(join(OUT, filename), svg);
  manifest[`week-${week}`] = alt;
  console.log(`week-${week}.svg  ${CANVAS_WIDTH}x${CANVAS_HEIGHT}  ${(svg.length / 1024).toFixed(1)} KB`);
}

// Printed, not written to a file: each lecture's markdown carries its own alt
// text next to its own image tag (one fact, one piece of code), so this is a
// review aid for whoever wires an image in, not a second copy of the text.
console.log("\nAlt text per week (paste into the matching lecture's image tag):\n");
for (const [week, alt] of Object.entries(manifest)) {
  console.log(`${week}: ${alt}\n`);
}
