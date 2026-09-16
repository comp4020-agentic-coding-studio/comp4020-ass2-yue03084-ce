/**
 * Shared drawing kit for the twelve lecture illustrations, so all twelve read
 * as one series rather than twelve one-off SVGs. Mirrors the two inks and the
 * riso-misregistration trick `scripts/make-images.mjs` uses for the hero and
 * the social card — same colours, same gold-under-ink offset — so a diagram
 * dropped into a lecture looks like it came from the same press as the
 * homepage.
 *
 * Each week module under `scripts/lecture-art/week-XX.mjs` exports
 * `{ alt, draw(width, height) }`; `draw` returns a full `<svg>` string built
 * from these helpers. `scripts/make-lecture-images.mjs` calls all twelve at a
 * fixed size and writes the result to `public/images/lectures/`.
 */

// Same three inks as scripts/make-images.mjs. Kept here (not imported from
// there) because that script draws on ink and these draw on paper, but the
// values themselves are one fact — if either changes, change both.
export const GOLD = "#b97d1c";
export const INK = "#16130d";
export const PAPER = "#f7f3ea";

export const CANVAS_WIDTH = 960;
export const CANVAS_HEIGHT = 540;

/** Stroke width for a primary line, scaled from the card artwork's ratio. */
export function strokeWeight(height) {
  return Math.max(3, height * 0.014);
}

/** Radius of the grain dots, scaled from the card artwork's ratio. */
export function dotWeight(height) {
  return Math.max(2, height * 0.006);
}

function grainPattern(id, dot) {
  return `<pattern id="${id}" width="${(dot * 4).toFixed(1)}" height="${(dot * 4).toFixed(1)}" patternUnits="userSpaceOnUse">
    <circle cx="${dot.toFixed(1)}" cy="${dot.toFixed(1)}" r="${(dot * 0.5).toFixed(1)}" fill="${GOLD}" opacity="0.45"/>
  </pattern>`;
}

/**
 * Wraps a body of markup in the paper ground both other pieces of artwork
 * share: cream background, a faint gold grain over the whole frame.
 */
export function frame(width, height, body) {
  const dot = dotWeight(height);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img">
  <defs>
    ${grainPattern("grain", dot)}
  </defs>
  <rect width="${width}" height="${height}" fill="${PAPER}"/>
  <rect width="${width}" height="${height}" fill="url(#grain)"/>
  ${body}
</svg>`;
}

/**
 * A line drawn as ink with a gold misregistration behind it — the same
 * two-colour riso look as the hero and the card. Use for the one or two
 * strokes that carry a diagram's main claim.
 */
export function duoStroke(d, strokeWidth, { cap = "round", join = "round" } = {}) {
  const dx = (strokeWidth * 0.9).toFixed(2);
  const dy = (strokeWidth * 1.1).toFixed(2);
  return `<path d="${d}" fill="none" stroke="${GOLD}" stroke-width="${strokeWidth.toFixed(2)}" stroke-linecap="${cap}" stroke-linejoin="${join}" transform="translate(${dx}, ${dy})"/><path d="${d}" fill="none" stroke="${INK}" stroke-width="${strokeWidth.toFixed(2)}" stroke-linecap="${cap}" stroke-linejoin="${join}"/>`;
}

/** A plain ink stroke, no misregistration — for secondary lines and rules. */
export function inkStroke(
  d,
  strokeWidth,
  { cap = "round", join = "round", opacity = 1, dash } = {},
) {
  const dashAttr = dash ? ` stroke-dasharray="${dash}"` : "";
  return `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${strokeWidth.toFixed(2)}" stroke-linecap="${cap}" stroke-linejoin="${join}" opacity="${opacity}"${dashAttr}/>`;
}

/** A shaded region — the gold band a nap or a claim gets highlighted with. */
export function goldBand(x, y, w, h, { opacity = 0.16, rx = 0 } = {}) {
  const rxAttr = rx ? ` rx="${rx}"` : "";
  return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" fill="${GOLD}" opacity="${opacity}"${rxAttr}/>`;
}

/** A short text label. Generic system sans only — this SVG is loaded as an
 * `<img>`, so it never sees the page's own font-face rules. */
export function label(
  x,
  y,
  text,
  { anchor = "middle", size = 20, weight = 500, fill = INK, opacity = 1, letterSpacing } = {},
) {
  const ls = letterSpacing ? ` letter-spacing="${letterSpacing}"` : "";
  return `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="${anchor}" font-family="'Public Sans', system-ui, sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}" opacity="${opacity}"${ls}>${text}</text>`;
}

/** A small filled circle — a marker on a curve, a point in time. */
export function marker(cx, cy, r, { fill = PAPER, stroke = INK, strokeWidth = 3 } = {}) {
  return `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth.toFixed(2)}"/>`;
}
