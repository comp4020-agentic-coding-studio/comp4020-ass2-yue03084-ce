/**
 * Week 4 — Why 2pm.
 *
 * The lecture's claim: alertness is what you get from two independent
 * processes added together, not one. Sleep pressure rises steadily the
 * longer you are awake and resets only after sleep — a sawtooth, not a wave.
 * The circadian rhythm oscillates on its own roughly-24-hour cycle and has
 * two troughs: a deep one at night and a smaller one about twelve hours away,
 * in the early afternoon. Drawn as two visually unlike lines over one
 * morning-to-night axis: a straight, resetting ink sawtooth for sleep
 * pressure underneath a smooth two-ink wave for the circadian rhythm, whose
 * small afternoon hollow is picked out with a marker and a gold band so it
 * reads as the week's point, not an accident of the curve.
 */
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  duoStroke,
  frame,
  goldBand,
  INK,
  inkStroke,
  label,
  marker,
  strokeWeight,
} from "./palette.mjs";

export const alt =
  "A two-ink chart spans a single day, morning at the left edge and night at " +
  "the right. A thin straight ink line climbs steadily from low on the left " +
  "to high on the right, then drops straight back down at the far edge and " +
  "begins climbing again — sleep pressure, rising all day and reset only by " +
  "sleep. Layered over it, a smooth ink-and-gold wave rises to a rounded peak " +
  "in the late morning, dips into a shallow hollow a little before the " +
  "midpoint of the day — marked with a small ringed circle sitting on a faint " +
  "gold band — climbs again to a second, evening peak, and then falls into a " +
  "much deeper trough near the right edge before turning back up: the " +
  "circadian rhythm's two troughs, one small and marked in the afternoon, one " +
  "far deeper at night.";

export function draw(width = CANVAS_WIDTH, height = CANVAS_HEIGHT) {
  const stroke = strokeWeight(height);

  const axisLeft = 80;
  const axisRight = 880;
  const axisY = 460;

  // Sleep pressure: a straight, monotonic climb across the whole waking day,
  // then a sharp vertical reset at "sleep", then a short climb resuming —
  // deliberately jagged and linear so it reads as a different kind of line
  // from the circadian wave below.
  const pressurePath = [
    `M${axisLeft},400`,
    `L780,160`,
    `L784,404`,
    `L${axisRight},372`,
  ].join(" ");

  // Circadian rhythm: a smooth wave through six hand-placed points — morning
  // rise, late-morning peak, the small afternoon trough (the week's claim),
  // an evening peak, the deep night trough, and the start of next morning's
  // recovery — connected with quadratic joins so consecutive segments share
  // a tangent and the line reads as one continuous curve, not a polyline.
  const circadianPoints = [
    [axisLeft, 230],
    [230, 150],
    [400, 262],
    [620, 172],
    [780, 430],
    [axisRight, 250],
  ];
  const circadianPath = smoothPath(circadianPoints);
  const [troughX, troughY] = circadianPoints[2];

  const tickPositions = [
    [axisLeft, "morning"],
    [400, "afternoon"],
    [780, "night"],
  ];
  const ticks = tickPositions
    .map(
      ([x]) =>
        inkStroke(`M${x},${axisY} L${x},${(axisY - 12).toFixed(1)}`, stroke * 0.35, { opacity: 0.6 }),
    )
    .join("");
  const tickLabels = tickPositions
    .map(([x, text]) => label(x, axisY + 30, text, { anchor: "middle", size: 20, opacity: 0.75 }))
    .join("");

  const body = `
    ${label(axisLeft, 60, "circadian rhythm", { anchor: "start", size: 24, weight: 600 })}
    ${label(axisLeft, 90, "sleep pressure", { anchor: "start", size: 22, weight: 500, opacity: 0.7 })}

    ${goldBand(troughX - 60, 120, 120, 340, { opacity: 0.14, rx: 6 })}

    ${inkStroke(`M${axisLeft},${axisY} L${axisRight},${axisY}`, stroke * 0.5, { opacity: 0.7 })}
    ${ticks}
    ${tickLabels}

    ${inkStroke(pressurePath, stroke * 0.7, { opacity: 0.85 })}
    ${duoStroke(circadianPath, stroke)}

    ${marker(troughX, troughY, stroke * 1.1)}
    ${label(troughX, 145, "afternoon dip", { anchor: "middle", size: 19, weight: 600 })}
  `;

  return frame(width, height, body);
}

/**
 * Smooths a polyline into a single quadratic path: each interior point
 * becomes a control point pulling toward the midpoint of it and its
 * neighbour, so the line passes near every point without a sharp corner at
 * any of them.
 */
function smoothPath(points) {
  const [first] = points;
  let d = `M${first[0]},${first[1]}`;
  for (let i = 1; i < points.length - 1; i += 1) {
    const [cx, cy] = points[i];
    const [nx, ny] = points[i + 1];
    const mx = (cx + nx) / 2;
    const my = (cy + ny) / 2;
    d += ` Q${cx},${cy} ${mx.toFixed(1)},${my.toFixed(1)}`;
  }
  const last = points[points.length - 1];
  d += ` T${last[0]},${last[1]}`;
  return d;
}
