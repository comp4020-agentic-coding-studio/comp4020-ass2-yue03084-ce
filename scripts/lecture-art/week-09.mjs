/**
 * Week 9 — Infants, elders, shift workers.
 *
 * The lecture's claim: three groups have the clearest physiological need
 * for daytime sleep, and the strength of that claim is a poor predictor of
 * whether they are permitted it. Each group's sleep has its own shape —
 * infants scattered across the whole day, older adults broken in the night
 * with a little spilling into the day, shift workers pushed whole into the
 * day the body did not expect.
 *
 * Drawn as three rows over one shared twenty-four-hour axis, a faint band
 * marking night in the middle of the strip (both edges of the axis read as
 * day, folded so night sits unbroken in the centre). Each row's pattern —
 * scattered marks, a broken bar with stray fragments, one solid bar sitting
 * outside the night band — is the whole argument; nothing here reads a
 * clock, only a shape.
 */
import { CANVAS_HEIGHT, CANVAS_WIDTH, duoStroke, frame, GOLD, INK, inkStroke, label, strokeWeight } from "./palette.mjs";

export const alt =
  "A two-ink diagram: three horizontal rows sit stacked over a shared day-long axis, with a faint shaded band running down the centre of the frame marking night (both edges of the axis read as day). The top row, labelled infants, is a scatter of nine short marks spread evenly across the whole width, day and night alike. The middle row, labelled older adults, is a bar broken into three uneven pieces inside the night band, with two smaller stray fragments sitting out in the daytime on either side. The bottom row, labelled shift workers, is a single solid bar drawn in the misregistered gold-and-ink line, sitting squarely in the daytime well outside the night band — the one row whose sleep is not where the band says it should be.";

export function draw(width = CANVAS_WIDTH, height = CANVAS_HEIGHT) {
  const stroke = strokeWeight(height);

  const axisLeft = 90;
  const axisRight = 870;
  const axisWidth = axisRight - axisLeft;

  // Night sits centred in the strip; both edges of the axis read as day, so
  // a block placed near either edge reads unambiguously as daytime.
  const nightLeft = axisLeft + axisWidth * 0.38;
  const nightRight = axisLeft + axisWidth * 0.62;

  const rowInfants = 168;
  const rowElders = 268;
  const rowShift = 368;
  const rowH = 26;

  const nightBand = `<rect x="${nightLeft.toFixed(1)}" y="120" width="${(nightRight - nightLeft).toFixed(1)}" height="320" fill="${INK}" opacity="0.06"/>`;

  // Infants: many short, irregular naps scattered across the whole day.
  const infantX = [0.05, 0.16, 0.27, 0.4, 0.5, 0.62, 0.74, 0.87, 0.95];
  let infantMarks = "";
  for (const t of infantX) {
    const x = axisLeft + t * axisWidth;
    infantMarks += `<rect x="${(x - 7).toFixed(1)}" y="${rowInfants - rowH / 2}" width="14" height="${rowH}" rx="4" fill="${GOLD}" opacity="0.65"/>`;
  }

  // Older adults: a nighttime block broken into pieces, plus two fragments
  // that have spilled out into daytime.
  const elderNightSegs = [
    [nightLeft + 6, nightLeft + 60],
    [nightLeft + 78, nightLeft + 130],
    [nightLeft + 148, nightRight - 6],
  ];
  let elderMarks = elderNightSegs
    .map(
      ([x1, x2]) =>
        `<rect x="${x1.toFixed(1)}" y="${rowElders - rowH / 2}" width="${(x2 - x1).toFixed(1)}" height="${rowH}" rx="4" fill="${GOLD}" opacity="0.65"/>`,
    )
    .join("");
  const elderDayFragX = [axisLeft + axisWidth * 0.14, axisLeft + axisWidth * 0.86];
  for (const x of elderDayFragX) {
    elderMarks += `<rect x="${(x - 10).toFixed(1)}" y="${rowElders - rowH / 2}" width="20" height="${rowH}" rx="4" fill="${GOLD}" opacity="0.4"/>`;
  }

  // Shift workers: one solid block, whole, sitting in daytime — the axis
  // the body did not expect it on.
  const shiftX1 = axisLeft + axisWidth * 0.08;
  const shiftX2 = axisLeft + axisWidth * 0.3;
  const shiftPath = `M${shiftX1},${rowShift - rowH / 2} L${shiftX2},${rowShift - rowH / 2} L${shiftX2},${rowShift + rowH / 2} L${shiftX1},${rowShift + rowH / 2} Z`;

  const rowLabelX = axisLeft;

  const body = `
    ${nightBand}
    ${label((nightLeft + nightRight) / 2, 108, "night", { size: 18, weight: 600, opacity: 0.6 })}
    ${label(axisLeft, 108, "day", { anchor: "start", size: 18, weight: 600, opacity: 0.6 })}
    ${label(axisRight, 108, "day", { anchor: "end", size: 18, weight: 600, opacity: 0.6 })}

    ${inkStroke(`M${axisLeft},${rowShift + 60} L${axisRight},${rowShift + 60}`, stroke * 0.3, { opacity: 0.45 })}

    ${label(rowLabelX, rowInfants - 24, "infants", { anchor: "start", size: 20, weight: 600 })}
    ${infantMarks}

    ${label(rowLabelX, rowElders - 24, "older adults", { anchor: "start", size: 20, weight: 600 })}
    ${elderMarks}

    ${label(rowLabelX, rowShift - 24, "shift workers", { anchor: "start", size: 20, weight: 600 })}
    ${duoStroke(shiftPath, stroke * 0.5)}
  `;

  return frame(width, height, body);
}
