/**
 * Generates the site's two pieces of artwork from one shared geometry.
 *
 * Both draw a hypnogram — the staircase a sleeper actually descends — with the
 * nap-length slice shaded in the brand gold. It is the course's own argument as
 * a picture: week 2's claim is that where you stop the descent decides what you
 * get, and the gold stops it before the line reaches the deep stage. Stock
 * photography of someone asleep at a desk would have said nothing the course
 * says.
 *
 * They are two drawings rather than one file at two sizes, and the reason is
 * measured. The theme renders the hero with `object-fit: cover` into boxes of
 * wildly different shape — 5.21:1 at 1920, 1.08:1 at 390 — so a single-cycle
 * chart loses its bottom stage to the desktop crop and, at phone width, loses
 * the gold window entirely: all that survived was a fragment of black steps
 * with nothing to read. So:
 *
 * - The hero repeats the cycle across the full width and confines it to the
 *   middle band of the height, which is the intersection the two crops leave.
 *   Any window onto it lands on whole cycles. The repetition is not a
 *   compromise: a night really is four or five of these laps, and shading the
 *   opening of each one says the nap is the first slice of a cycle, not a
 *   small night.
 * - The card keeps the single, complete cycle. At a fixed 1200x630 nothing
 *   crops it, so it can afford the whole argument in one pass.
 *
 * Committed rather than run once and forgotten, for two reasons. The artwork is
 * demonstrably the author's, which a binary dropped into `assets/` is not; and
 * the stage geometry stays in one place, so the two never drift into disagreeing
 * about where slow-wave sleep sits.
 *
 * Deliberately no text in either image. The course code and title would be a
 * second home for facts that live in `course-config.ts`, and no check can read
 * a word baked into a raster — the social card's title comes from `og:title`,
 * which does read from there.
 *
 * Run: node scripts/make-images.mjs
 */

import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "assets", "images");

// SlopU's two inks on its paper. The gold is `--at-primary` exactly; the ink is
// the warm near-black the theme's dark surfaces sit at, not a pure #000, so the
// pair reads as printed rather than as a screenshot.
const GOLD = "#b97d1c";
const INK = "#16130d";
const PAPER = "#f7f3ea";

/** Minutes of nap the whole course turns on; mirrors NAP_MINUTES. */
const NAP_MINUTES = 20;
const CYCLE_MINUTES = 90;

// Depth of each stage, as a fraction of the plot height. A hypnogram is drawn
// deeper = lower, so awake sits at the top and slow-wave at the bottom.
const DEPTH = { awake: 0.05, rem: 0.28, n1: 0.47, n2: 0.68, n3: 0.93 };

// One descent and return, in minutes. This is the shape the lecture describes:
// down through light sleep into slow-wave by the half hour, back up through REM
// near the ninety.
const HYPNOGRAM = [
  [0, 4, "awake"],
  [4, 9, "n1"],
  [9, 25, "n2"],
  [25, 45, "n3"],
  [45, 58, "n2"],
  [58, 72, "rem"],
  [72, 81, "n2"],
  [81, 87, "n1"],
  [87, 90, "awake"],
];

/**
 * One cycle's stepped path, over a given horizontal span and vertical band.
 * Shared by both drawings so the stages sit at the same relative depths in each.
 */
function cyclePath(x0, spanW, bandTop, bandH) {
  const x = (minute) => x0 + (minute / CYCLE_MINUTES) * spanW;
  const y = (stage) => bandTop + DEPTH[stage] * bandH;
  let path = "";
  for (const [from, to, stage] of HYPNOGRAM) {
    path += `${path ? "L" : "M"}${x(from).toFixed(1)} ${y(stage).toFixed(1)}L${x(to).toFixed(1)} ${y(stage).toFixed(1)}`;
  }
  return path;
}

/**
 * The hero: the cycle repeated across the full width, on ink.
 *
 * Dark on purpose. The theme lays a dark gradient over the hero so its white
 * title has something to sit on, and over the light version that gradient
 * turned the cream paper to a murky grey — the ground looked like a mistake
 * rather than a choice. On ink it reads as intended, and the gold gains
 * contrast instead of losing it.
 *
 * `band` is the fraction of the height the wave is allowed to occupy, centred.
 * The desktop crop keeps roughly the middle 45% of the source height, so the
 * wave lives inside that; the dot field covers the rest, which is what the
 * phone crop — which keeps the full height and slices the width instead — shows
 * above and below it.
 */
function heroSvg(width, height, { cycles = 4, band = 0.36 } = {}) {
  const bandH = height * band;
  const bandTop = (height - bandH) / 2;
  const period = width / cycles;
  const stroke = Math.max(4, height * 0.018);
  const dot = Math.max(2, height * 0.007);
  const napSpan = (NAP_MINUTES / CYCLE_MINUTES) * period;

  let waves = "";
  let naps = "";
  for (let index = 0; index < cycles; index += 1) {
    const x0 = index * period;
    const path = cyclePath(x0, period, bandTop, bandH);
    // Gold misregistration under the ink line, the way a two-colour riso lands.
    waves += `<path d="${path}" fill="none" stroke="${GOLD}" stroke-width="${stroke.toFixed(2)}" stroke-linejoin="round" stroke-linecap="square" opacity="0.95"/>`;
    naps += `<rect x="${x0.toFixed(1)}" y="0" width="${napSpan.toFixed(1)}" height="${height}" fill="${GOLD}" opacity="0.13"/>`;
    naps += `<line x1="${(x0 + napSpan).toFixed(1)}" y1="0" x2="${(x0 + napSpan).toFixed(1)}" y2="${height}" stroke="${GOLD}" stroke-width="${(stroke * 0.4).toFixed(2)}" opacity="0.5"/>`;
  }

  const rules = Object.values(DEPTH)
    .map(
      (depth) =>
        `<line x1="0" y1="${(bandTop + depth * bandH).toFixed(1)}" x2="${width}" y2="${(bandTop + depth * bandH).toFixed(1)}" stroke="${PAPER}" stroke-width="${(stroke * 0.12).toFixed(2)}" opacity="0.22"/>`,
    )
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <pattern id="grain" width="${(dot * 5).toFixed(1)}" height="${(dot * 5).toFixed(1)}" patternUnits="userSpaceOnUse">
      <circle cx="${dot.toFixed(1)}" cy="${dot.toFixed(1)}" r="${(dot * 0.42).toFixed(1)}" fill="${GOLD}" opacity="0.16"/>
    </pattern>
  </defs>
  <rect width="${width}" height="${height}" fill="${INK}"/>
  <rect width="${width}" height="${height}" fill="url(#grain)"/>
  ${naps}
  ${rules}
  ${waves}
</svg>`;
}

/**
 * The card: one complete cycle on paper, at a fixed 1200x630 nothing crops.
 */
function cardSvg(width, height) {
  const padX = width * 0.08;
  const padY = height * 0.16;
  const plotW = width - padX * 2;
  const plotH = height - padY * 2;

  const x = (minute) => padX + (minute / CYCLE_MINUTES) * plotW;
  const y = (stage) => padY + DEPTH[stage] * plotH;

  const path = cyclePath(padX, plotW, padY, plotH);
  const stroke = Math.max(3, height * 0.014);
  const napX = x(NAP_MINUTES);

  // Stage rules, so the descent is read against something.
  const rules = Object.values(DEPTH)
    .map(
      (depth) =>
        `<line x1="${padX.toFixed(1)}" y1="${(padY + depth * plotH).toFixed(1)}" x2="${(padX + plotW).toFixed(1)}" y2="${(padY + depth * plotH).toFixed(1)}" stroke="${INK}" stroke-width="${(stroke * 0.16).toFixed(2)}" opacity="0.28"/>`,
    )
    .join("");

  const dot = Math.max(2, height * 0.006);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <pattern id="grain" width="${(dot * 4).toFixed(1)}" height="${(dot * 4).toFixed(1)}" patternUnits="userSpaceOnUse">
      <circle cx="${dot.toFixed(1)}" cy="${dot.toFixed(1)}" r="${(dot * 0.5).toFixed(1)}" fill="${GOLD}" opacity="0.5"/>
    </pattern>
  </defs>
  <rect width="${width}" height="${height}" fill="${PAPER}"/>

  <!-- The nap: the part of the descent this course is about, stopped before
       the line reaches the deep stage at the bottom. -->
  <rect x="${padX.toFixed(1)}" y="${(padY * 0.55).toFixed(1)}" width="${(napX - padX).toFixed(1)}" height="${(plotH + padY * 0.9).toFixed(1)}" fill="${GOLD}" opacity="0.17"/>
  <rect x="${padX.toFixed(1)}" y="${(padY * 0.55).toFixed(1)}" width="${(napX - padX).toFixed(1)}" height="${(plotH + padY * 0.9).toFixed(1)}" fill="url(#grain)"/>
  <line x1="${napX.toFixed(1)}" y1="${(padY * 0.55).toFixed(1)}" x2="${napX.toFixed(1)}" y2="${(padY * 0.55 + plotH + padY * 0.9).toFixed(1)}" stroke="${GOLD}" stroke-width="${(stroke * 0.7).toFixed(2)}"/>

  ${rules}

  <!-- Gold misregistration under the ink, the way a two-colour riso lands. -->
  <path d="${path}" fill="none" stroke="${GOLD}" stroke-width="${stroke.toFixed(2)}" stroke-linejoin="round" stroke-linecap="square" transform="translate(${(stroke * 0.9).toFixed(1)}, ${(stroke * 1.1).toFixed(1)})"/>
  <path d="${path}" fill="none" stroke="${INK}" stroke-width="${stroke.toFixed(2)}" stroke-linejoin="round" stroke-linecap="square"/>

  <!-- Where the sleeper is when the nap ends: still above slow-wave. -->
  <circle cx="${napX.toFixed(1)}" cy="${y("n2").toFixed(1)}" r="${(stroke * 1.5).toFixed(1)}" fill="${PAPER}" stroke="${INK}" stroke-width="${(stroke * 0.55).toFixed(2)}"/>
</svg>`;
}

const jobs = [
  // Hero: the dimensions the starter shipped at, so the theme's own responsive
  // widths keep working untouched.
  {
    name: "hero-home.avif",
    width: 2560,
    height: 1086,
    draw: heroSvg,
    encode: (p) => p.avif({ quality: 62 }),
  },
  // Social card: 1200x630 is what the platforms crop to.
  {
    name: "card.png",
    width: 1200,
    height: 630,
    draw: cardSvg,
    encode: (p) => p.png({ compressionLevel: 9 }),
  },
];

for (const { name, width, height, draw, encode } of jobs) {
  const buffer = Buffer.from(draw(width, height));
  const out = await encode(sharp(buffer, { density: 144 }).resize(width, height)).toBuffer();
  await writeFile(join(OUT, name), out);
  console.log(`${name}  ${width}x${height}  ${(out.length / 1024).toFixed(0)} KB`);
}
