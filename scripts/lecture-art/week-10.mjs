/**
 * Week 10 — Measuring the nap.
 *
 * The lecture's claim: polysomnography is the reference standard because it
 * reads the brain directly; a wrist device reads movement and heart rate and
 * infers the rest, at a resolution coarse enough that a short nap can fall
 * through it. Drawn as two registers sharing one time axis — a fine, stepped
 * hypnogram above (polysomnography, several distinct stages, primary
 * `duoStroke`) and a flat, undifferentiated line below (the wearable), cut by
 * only two wide epoch ticks so coarse that neither epoch holds a majority of
 * sleep and the device reports no nap at all, while a dashed box shows where
 * one actually happened. A fine, evenly ticked ruler along the bottom carries
 * the real, continuous time both registers are measured against.
 */
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  duoStroke,
  frame,
  GOLD,
  INK,
  inkStroke,
  label,
  marker,
  strokeWeight,
} from "./palette.mjs";

export const alt =
  "A two-ink diagram on a shared time axis. In the upper register, a stepped black line traces a short nap in fine detail: it drops from an awake baseline through light sleep into a brief deep stage, back through light sleep and partway up again before returning to the awake line — five distinct steps, drawn as the primary gold-and-ink line, with a pale gold band beneath marking the nap's true span. In the lower register, spanning the same width, a single flat ink line runs level the entire way with no dip at all, crossed by only two wide tick marks dividing the whole width into two coarse blocks — neither holds enough of the nap to register it. A dashed rectangle outlines where the real nap sat, stranded between the device's two blocks. A finely and evenly ticked ruler along the bottom marks continuous time for comparison.";

export function draw(width = CANVAS_WIDTH, height = CANVAS_HEIGHT) {
  const stroke = strokeWeight(height);

  const left = 80;
  const right = 880;
  const napStart = 340;
  const napEnd = 600;

  const psgBaseline = 150;
  const psgLight = 190;
  const psgDeep = 230;
  const psgRem = 165;

  const psgPath = [
    `M${left},${psgBaseline}`,
    `L${napStart},${psgBaseline}`,
    `L${napStart},${psgLight}`,
    `L400,${psgLight}`,
    `L400,${psgDeep}`,
    `L480,${psgDeep}`,
    `L480,${psgLight}`,
    `L540,${psgLight}`,
    `L540,${psgRem}`,
    `L${napEnd},${psgRem}`,
    `L${napEnd},${psgBaseline}`,
    `L${right},${psgBaseline}`,
  ].join(" ");

  // The device's own sampling grid — two wide epochs is deliberately too
  // coarse: the nap (340–600) never holds a majority of either one, so a
  // majority-vote classifier reports plain, unbroken "awake" the whole way.
  const epochY0 = 330;
  const epochY1 = 400;
  const epochXs = [left, 480, right];
  const deviceLine = 365;

  const fineRulerY = 470;
  const tickCount = 16;
  const tickSpacing = (right - left) / (tickCount - 1);
  let fineTicks = "";
  for (let i = 0; i < tickCount; i += 1) {
    const x = left + i * tickSpacing;
    fineTicks += inkStroke(`M${x.toFixed(1)},${fineRulerY} L${x.toFixed(1)},${(fineRulerY - 14).toFixed(1)}`, stroke * 0.35);
  }

  let epochTicks = "";
  for (const x of epochXs) {
    epochTicks += inkStroke(`M${x},${epochY0} L${x},${epochY1}`, stroke * 0.7);
  }

  const body = `
    ${label(left, 70, "polysomnography", { anchor: "start", size: 24, weight: 600 })}
    ${label(left, 300, "wrist device", { anchor: "start", size: 24, weight: 600, opacity: 0.85 })}
    ${label(left, 505, "continuous time", { anchor: "start", size: 20, weight: 600, opacity: 0.65 })}

    <rect x="${napStart}" y="95" width="${napEnd - napStart}" height="365" fill="${GOLD}" opacity="0.14"/>

    ${duoStroke(psgPath, stroke)}
    ${marker(napStart, psgBaseline, stroke * 0.8, { fill: INK, stroke: INK })}
    ${marker(napEnd, psgBaseline, stroke * 0.8, { fill: INK, stroke: INK })}

    ${epochTicks}
    ${inkStroke(`M${left},${deviceLine} L${right},${deviceLine}`, stroke * 0.9)}
    <rect x="${napStart}" y="${epochY0}" width="${napEnd - napStart}" height="${epochY1 - epochY0}" fill="none" stroke="${INK}" stroke-width="${(stroke * 0.4).toFixed(2)}" stroke-dasharray="8,7" opacity="0.6"/>
    ${label((napStart + napEnd) / 2, epochY1 + 26, "undetected", { anchor: "middle", size: 17, weight: 500, opacity: 0.7 })}

    ${inkStroke(`M${left},${fineRulerY} L${right},${fineRulerY}`, stroke * 0.55, { opacity: 0.75 })}
    ${fineTicks}
  `;

  return frame(width, height, body);
}
