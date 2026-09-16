/**
 * Week 11 — Naps and memory.
 *
 * The lecture's claim: sleep does not merely rest the brain, it consolidates
 * what was just learned — material slept on is retained better than material
 * left awake for the same stretch. Drawn as two retention curves running from
 * a shared moment of learning: one dips only slightly through a gold-shaded
 * nap band and recovers to a high, stable level (primary `duoStroke`), the
 * other declines steadily across the same span with no interruption at all
 * (secondary `inkStroke`), ending well below the first.
 */
import { CANVAS_HEIGHT, CANVAS_WIDTH, duoStroke, frame, GOLD, INK, inkStroke, label, marker, PAPER, strokeWeight } from "./palette.mjs";

export const alt =
  "A two-ink diagram: two lines run left to right from a single marked point labelled learning. The upper line, in gold and ink, dips only slightly as it crosses a pale gold band marking a nap, then recovers and levels out high for the rest of its length, labelled with a nap. The lower, plain ink line declines steadily and without interruption across the same span, passing through the gold band as if it were not there, and ends far lower than the first, labelled no nap. A plain ruled axis beneath both is labelled time since learning.";

export function draw(width = CANVAS_WIDTH, height = CANVAS_HEIGHT) {
  const stroke = strokeWeight(height);

  const left = 80;
  const right = 880;
  const learnX = 120;
  const learnY = 150;

  const napStart = 420;
  const napEnd = 540;

  const nappedPath = [
    `M${learnX},${learnY}`,
    `L${napStart},175`,
    `L480,186`,
    `L${napEnd},160`,
    `L700,168`,
    `L${right},178`,
  ].join(" ");

  const noNapPath = [
    `M${learnX},${learnY}`,
    `L300,196`,
    `L${napStart},225`,
    `L${napEnd},250`,
    `L700,281`,
    `L${right},310`,
  ].join(" ");

  const axisY = 460;
  const tickCount = 7;
  const tickSpacing = (right - left) / (tickCount - 1);
  let ticks = "";
  for (let i = 0; i < tickCount; i += 1) {
    const x = left + i * tickSpacing;
    ticks += inkStroke(`M${x.toFixed(1)},${axisY} L${x.toFixed(1)},${(axisY - 12).toFixed(1)}`, stroke * 0.4, { opacity: 0.6 });
  }

  const body = `
    ${label(left, 70, "retention", { anchor: "start", size: 24, weight: 600 })}
    ${label(left, 505, "time since learning", { anchor: "start", size: 22, weight: 600, opacity: 0.75 })}

    <rect x="${napStart}" y="90" width="${napEnd - napStart}" height="360" fill="${GOLD}" opacity="0.16"/>
    ${label((napStart + napEnd) / 2, 110, "nap", { anchor: "middle", size: 18, weight: 600, opacity: 0.85 })}

    ${inkStroke(`M${left},${axisY} L${right},${axisY}`, stroke * 0.55, { opacity: 0.75 })}
    ${ticks}

    ${inkStroke(noNapPath, stroke * 0.85)}
    ${duoStroke(nappedPath, stroke)}

    ${marker(learnX, learnY, stroke * 1.2, { fill: PAPER, stroke: INK })}
    ${label(learnX, 122, "learning", { anchor: "middle", size: 18, weight: 500 })}

    ${label(right, 160, "with a nap", { anchor: "end", size: 19, weight: 600 })}
    ${label(right, 332, "no nap", { anchor: "end", size: 19, weight: 600, opacity: 0.8 })}
  `;

  return frame(width, height, body);
}
