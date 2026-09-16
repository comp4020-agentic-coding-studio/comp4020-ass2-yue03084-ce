/**
 * Week 2 — Twenty minutes or ninety.
 *
 * The lecture's claim: there are two good nap lengths and a bad one between
 * them. Stop before slow-wave sleep and it is short and fine; ride the full
 * cycle back up through lighter sleep and it is long and fine; wake out of
 * slow-wave sleep itself, in the gap between those two, and sleep inertia
 * costs more than the nap returned. Drawn as the same stepped hypnogram as
 * week 1, but with a strip beneath it split into three zones lined up with
 * the stages above them: a flat gold band under awake-and-light (safe,
 * short), a cross-hatched band under slow-wave sleep (the dead zone — made
 * to look different in kind, not just shade, since the palette has no third
 * colour to spend on a warning), and a second flat gold band under REM and
 * the return to awake (safe, full cycle).
 */
import { CANVAS_HEIGHT, CANVAS_WIDTH, duoStroke, frame, goldBand, INK, inkStroke, label, strokeWeight } from "./palette.mjs";

export const alt =
  "A two-ink diagram of one sleep cycle drawn as a stepped hypnogram, the " +
  "same shape as week one's: a line drops from 'awake' through 'light sleep' " +
  "to 'slow-wave sleep' at the bottom, then climbs back through 'REM' to " +
  "'awake' again. Beneath it runs a strip divided into three zones lined up " +
  "with the stages above them. The first zone, under awake and light sleep, " +
  "is a flat gold band labelled safe, short nap. The middle zone, directly " +
  "under the slow-wave-sleep plateau, is cross-hatched and outlined in ink " +
  "rather than filled flat, labelled dead zone. The third zone, under REM " +
  "and the return to awake, is a flat gold band again, labelled safe, full " +
  "cycle. The hatched middle zone reads as a different kind of mark from the " +
  "two gold ones on either side of it, not just a different shade.";

export function draw(width = CANVAS_WIDTH, height = CANVAS_HEIGHT) {
  const stroke = strokeWeight(height);

  // Same stage geometry as week 1's hypnogram, so the two read as one
  // family — this week just adds the zone strip underneath.
  const AWAKE_Y = 110;
  const LIGHT_Y = 230;
  const DEEP_Y = 400;
  const REM_Y = 280;

  const X0 = 80;
  const X1 = 220;
  const X2 = 400; // light sleep ends / slow-wave begins — zone 1 / zone 2 boundary
  const X3 = 620; // slow-wave ends / REM begins — zone 2 / zone 3 boundary
  const X4 = 800;
  const X5 = 880;

  const path = [
    `M${X0},${AWAKE_Y}`,
    `L${X1},${AWAKE_Y}`,
    `L${X1},${LIGHT_Y}`,
    `L${X2},${LIGHT_Y}`,
    `L${X2},${DEEP_Y}`,
    `L${X3},${DEEP_Y}`,
    `L${X3},${REM_Y}`,
    `L${X4},${REM_Y}`,
    `L${X4},${AWAKE_Y}`,
    `L${X5},${AWAKE_Y}`,
  ].join(" ");

  const stripTop = 445;
  const stripHeight = 46;

  const hatchId = "week02-deadzone-hatch";
  const hatchDef = `<defs><pattern id="${hatchId}" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
    <rect width="12" height="12" fill="none"/>
    <line x1="0" y1="0" x2="0" y2="12" stroke="${INK}" stroke-width="3" opacity="0.55"/>
  </pattern></defs>`;

  // Drop-lines tying each zone boundary back up to the stage transition it
  // sits under, so the strip reads as "this is what's underneath the curve"
  // rather than a floating, unrelated legend.
  const guides = [X0, X2, X3, X5]
    .map((x) => inkStroke(`M${x},${DEEP_Y + 8} L${x},${stripTop}`, stroke * 0.25, { opacity: 0.4, dash: "3 6" }))
    .join("");

  const zone1 = goldBand(X0, stripTop, X2 - X0, stripHeight, { opacity: 0.4 });
  const zone3 = goldBand(X3, stripTop, X5 - X3, stripHeight, { opacity: 0.4 });
  const zone2 = `<rect x="${X2}" y="${stripTop}" width="${X3 - X2}" height="${stripHeight}" fill="url(#${hatchId})" stroke="${INK}" stroke-width="${(stroke * 0.5).toFixed(2)}"/>`;

  const body = `
    ${hatchDef}
    ${duoStroke(path, stroke)}

    ${label(X0, AWAKE_Y - 18, "awake", { anchor: "start", size: 20 })}
    ${label((X1 + X2) / 2, LIGHT_Y - 16, "light sleep", { size: 20 })}
    ${label((X2 + X3) / 2, DEEP_Y + 34, "slow-wave sleep", { size: 20, opacity: 0.85 })}
    ${label((X3 + X4) / 2, REM_Y - 16, "REM", { size: 20 })}

    ${guides}
    ${zone1}
    ${zone2}
    ${zone3}
    <rect x="${X0}" y="${stripTop}" width="${X5 - X0}" height="${stripHeight}" fill="none" stroke="${INK}" stroke-width="${(stroke * 0.18).toFixed(2)}" opacity="0.5"/>

    ${label((X0 + X2) / 2, stripTop + stripHeight / 2 + 6, "safe: short nap", { size: 16, weight: 600 })}
    ${label((X2 + X3) / 2, stripTop + stripHeight / 2 + 6, "dead zone", { size: 16, weight: 700 })}
    ${label((X3 + X5) / 2, stripTop + stripHeight / 2 + 6, "safe: full cycle", { size: 16, weight: 600 })}
  `;

  return frame(width, height, body);
}
