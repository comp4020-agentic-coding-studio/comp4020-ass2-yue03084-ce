/**
 * Week 5 — How the Industrial Revolution killed the nap.
 *
 * The lecture's claim: before industrial work the day was organised around
 * tasks with their own natural length; afterwards it was organised around
 * hours that did not care what you were doing. Drawn as two registers — a
 * sun's arc with irregular task-boundary markers above a ruler of perfectly
 * even clock-ticks — with a factory clock face physically overlapping and
 * erasing part of the arc, the way clock time didn't coexist with task time
 * so much as overwrite it.
 */
import { CANVAS_HEIGHT, CANVAS_WIDTH, duoStroke, frame, GOLD, INK, inkStroke, label, marker, PAPER, strokeWeight } from "./palette.mjs";

export const alt =
  "A two-ink diagram: a smooth arc rises and falls like the sun's path across a day, with four unevenly spaced dots along it marking where one task ended and another began. Beneath it, a straight ruled line is marked off in perfectly even ticks, labelled the clock's time. A large clock face, its two hands stacked straight up, sits on top of the arc's falling side — its hard circular edge erases a stretch of the curve, and a small gold dot marks the exact point where the smooth line disappears behind it.";

export function draw(width = CANVAS_WIDTH, height = CANVAS_HEIGHT) {
  const stroke = strokeWeight(height);
  const arcPath = "M80,380 Q480,20 880,380";

  // Four task-boundary points read off the arc at irregular parameter steps —
  // task time has no fixed interval between one task ending and the next.
  const taskMarkers = [
    [144, 327],
    [304, 235],
    [440, 202],
    [560, 207],
  ];

  const rulerY = 470;
  const rulerLeft = 80;
  const rulerRight = 880;
  const tickCount = 16;
  const tickSpacing = (rulerRight - rulerLeft) / (tickCount - 1);
  let ticks = "";
  for (let i = 0; i < tickCount; i += 1) {
    const x = rulerLeft + i * tickSpacing;
    ticks += inkStroke(`M${x.toFixed(1)},${rulerY} L${x.toFixed(1)},${(rulerY - 14).toFixed(1)}`, stroke * 0.35);
  }

  const clockCx = 700;
  const clockCy = 300;
  const clockR = 130;
  let hourTicks = "";
  for (let h = 0; h < 12; h += 1) {
    const angle = (Math.PI / 6) * h - Math.PI / 2;
    const x1 = clockCx + Math.cos(angle) * (clockR - 16);
    const y1 = clockCy + Math.sin(angle) * (clockR - 16);
    const x2 = clockCx + Math.cos(angle) * (clockR - 4);
    const y2 = clockCy + Math.sin(angle) * (clockR - 4);
    hourTicks += inkStroke(
      `M${x1.toFixed(1)},${y1.toFixed(1)} L${x2.toFixed(1)},${y2.toFixed(1)}`,
      stroke * 0.4,
    );
  }

  const body = `
    ${label(rulerLeft, 60, "task time", { anchor: "start", size: 24, weight: 600 })}
    ${label(rulerLeft, 505, "clock time", { anchor: "start", size: 24, weight: 600, opacity: 0.75 })}

    ${duoStroke(arcPath, stroke)}
    ${taskMarkers.map(([x, y]) => marker(x, y, stroke * 0.9, { fill: INK, stroke: INK })).join("")}

    ${inkStroke(`M${rulerLeft},${rulerY} L${rulerRight},${rulerY}`, stroke * 0.55, { opacity: 0.75 })}
    ${ticks}

    <circle cx="${clockCx}" cy="${clockCy}" r="${clockR}" fill="${PAPER}" stroke="${INK}" stroke-width="${(stroke * 0.9).toFixed(2)}"/>
    ${hourTicks}
    ${inkStroke(`M${clockCx},${clockCy} L${clockCx},${(clockCy - 100).toFixed(1)}`, stroke * 0.9)}
    <circle cx="${clockCx}" cy="${clockCy}" r="${(stroke * 0.6).toFixed(2)}" fill="${INK}"/>

    <circle cx="601" cy="216" r="${(stroke * 0.5).toFixed(2)}" fill="${GOLD}" stroke="${INK}" stroke-width="1.5"/>
  `;

  return frame(width, height, body);
}
