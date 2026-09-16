/**
 * Week 1 — What is a nap.
 *
 * The lecture's claim: sleep is not one thing but a sequence — light sleep,
 * then slow-wave sleep, then REM, roughly ninety minutes for a full lap — and
 * a nap is an entry into that sequence, stopped partway. Which stage you were
 * in when it stopped is what decides how you feel, not how tired you were.
 * Drawn as a single stepped hypnogram (a plain staircase, since later weeks
 * specialise this shape): one descent through light sleep into slow-wave
 * sleep, a climb back through REM to waking, with four ringed points at
 * different depths along the descent marking candidate places a nap could
 * have been cut off.
 */
import { CANVAS_HEIGHT, CANVAS_WIDTH, duoStroke, frame, INK, label, marker, strokeWeight } from "./palette.mjs";

export const alt =
  "A two-ink diagram of one sleep cycle drawn as a stepped hypnogram. A line " +
  "starts flat at 'awake', steps down onto a 'light sleep' plateau, steps " +
  "down again onto a 'slow-wave sleep' plateau at the bottom of the chart, " +
  "then steps back up onto a 'REM' plateau before returning to 'awake'. Four " +
  "small ringed markers sit at different depths along the descending half of " +
  "the line only — one just under the awake line, one in light sleep, one on " +
  "the drop between light and slow-wave sleep, and one already inside " +
  "slow-wave sleep — each a different point where a nap could have been cut " +
  "off, showing that the depth reached when it stops is what decides the " +
  "outcome, not how long the eyes were closed.";

export function draw(width = CANVAS_WIDTH, height = CANVAS_HEIGHT) {
  const stroke = strokeWeight(height);

  // Stage depths (SVG y, so larger = deeper/lower on the chart) and the time
  // (x) at which the line steps from one stage to the next. Mirrors the
  // lecture's own order: awake, light, slow-wave, REM, awake — one full lap,
  // roughly ninety minutes, though no clock value is drawn.
  const AWAKE_Y = 110;
  const LIGHT_Y = 230;
  const DEEP_Y = 400;
  const REM_Y = 280;

  const X0 = 80; // wake, start
  const X1 = 220; // enters light sleep
  const X2 = 400; // enters slow-wave sleep
  const X3 = 620; // leaves slow-wave, climbing toward REM
  const X4 = 800; // wakes
  const X5 = 880; // end

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

  // Four candidate stop-points, at four different depths, all on the
  // descending half of the line (X0 to X2) — the only half the lecture is
  // making a claim about.
  const stopPoints = [
    [X1, (AWAKE_Y + LIGHT_Y) / 2], // barely under: still almost awake
    [(X1 + X2) / 2, LIGHT_Y], // settled in light sleep
    [X2, (LIGHT_Y + DEEP_Y) / 2], // caught mid-drop into slow-wave
    [X2 + 90, DEEP_Y], // already in slow-wave sleep
  ];

  const body = `
    ${label(X0, 60, "one lap of the cycle, about ninety minutes", { anchor: "start", size: 22, weight: 600, opacity: 0.85 })}

    ${duoStroke(path, stroke)}

    ${label(X0, AWAKE_Y - 18, "awake", { anchor: "start", size: 20 })}
    ${label((X1 + X2) / 2, LIGHT_Y - 16, "light sleep", { size: 20 })}
    ${label((X2 + X3) / 2, DEEP_Y + 36, "slow-wave sleep", { size: 20 })}
    ${label((X3 + X4) / 2, REM_Y - 16, "REM", { size: 20 })}

    ${stopPoints.map(([x, y]) => marker(x, y, stroke * 0.95, { fill: "#f7f3ea", stroke: INK, strokeWidth: stroke * 0.4 })).join("")}

    ${label(stopPoints[0][0] - 14, stopPoints[0][1] - 16, "stop here?", { anchor: "end", size: 15, weight: 500, opacity: 0.7 })}
  `;

  return frame(width, height, body);
}
