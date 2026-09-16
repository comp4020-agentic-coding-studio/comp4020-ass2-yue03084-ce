/**
 * Week 7 — The politics of the office nap.
 *
 * The lecture's claim: who is permitted to rest at work tracks seniority and
 * autonomy, not tiredness. The people most able to close a door are judged
 * over months; the people least able are judged by the hour, or by a queue.
 * Visibility is the mechanism — being *seen* asleep means something
 * different depending on the sleeper's position.
 *
 * Drawn as a single wedge running left to right: a gap between two lines
 * that starts narrow (low autonomy, constant visibility, no room to rest)
 * and opens wide (high autonomy, a closed door). An eye sits in the narrow
 * end — the watching that fills every gap when there's no room to hide in
 * it. A closed door sits in the wide end, comfortably inside the space that
 * autonomy buys.
 */
import { CANVAS_HEIGHT, CANVAS_WIDTH, duoStroke, frame, GOLD, INK, inkStroke, label, strokeWeight } from "./palette.mjs";

export const alt =
  "A two-ink diagram: two lines run from left to right across the frame, close together at the left edge and spreading steadily apart toward the right, so the gap between them forms a wedge that is narrow on the left and wide on the right. The narrow gap is shaded faintly and holds a small open eye shape, its pupil watching. The wide gap on the right holds a simple closed door — a rectangle with a vertical seam and a small knob. A caption under the narrow end reads 'judged by the hour', a caption under the wide end reads 'judged over months', and a label above the widening gap reads 'room to rest'.";

export function draw(width = CANVAS_WIDTH, height = CANVAS_HEIGHT) {
  const stroke = strokeWeight(height);

  const leftX = 110;
  const rightX = 850;
  const topLeftY = 232;
  const topRightY = 108;
  const bottomLeftY = 308;
  const bottomRightY = 432;

  const topEdge = `M${leftX},${topLeftY} L${rightX},${topRightY}`;
  const bottomEdge = `M${leftX},${bottomLeftY} L${rightX},${bottomRightY}`;
  const wedgeFill = `M${leftX},${topLeftY} L${rightX},${topRightY} L${rightX},${bottomRightY} L${leftX},${bottomLeftY} Z`;

  // Gap centre and half-height at a given x, for placing the eye and door
  // squarely inside the wedge rather than guessing coordinates by eye.
  const gapAt = (x) => {
    const t = (x - leftX) / (rightX - leftX);
    const top = topLeftY + t * (topRightY - topLeftY);
    const bottom = bottomLeftY + t * (bottomRightY - bottomLeftY);
    return { top, bottom, centre: (top + bottom) / 2, half: (bottom - top) / 2 };
  };

  // The eye, sitting in the narrow end. Two shallow curves meeting at
  // points, a pupil, and a few short rays above it standing for the
  // surveillance that fills a gap with no room to close a door in.
  const eyeCx = 160;
  const eyeGap = gapAt(eyeCx);
  const eyeHalfW = 34;
  const eyeHalfH = Math.min(16, eyeGap.half * 0.7);
  const eyePath = `M${eyeCx - eyeHalfW},${eyeGap.centre} Q${eyeCx},${eyeGap.centre - eyeHalfH * 1.8} ${eyeCx + eyeHalfW},${eyeGap.centre} Q${eyeCx},${eyeGap.centre + eyeHalfH * 1.8} ${eyeCx - eyeHalfW},${eyeGap.centre} Z`;
  let rays = "";
  for (const angle of [-0.55, 0, 0.55]) {
    const rx1 = eyeCx + Math.sin(angle) * 14;
    const ry1 = eyeGap.centre - eyeHalfH * 1.9 - Math.cos(angle) * 4;
    const rx2 = eyeCx + Math.sin(angle) * 20;
    const ry2 = ry1 - 16;
    rays += inkStroke(`M${rx1.toFixed(1)},${ry1.toFixed(1)} L${rx2.toFixed(1)},${ry2.toFixed(1)}`, stroke * 0.35, {
      opacity: 0.55,
    });
  }

  // The door, sitting in the wide end where the gap is generous enough to
  // hold one comfortably — a plain rectangle with a seam and a knob.
  const doorCx = 780;
  const doorGap = gapAt(doorCx);
  const doorW = 96;
  const doorH = Math.min(200, doorGap.half * 1.6);
  const doorX = doorCx - doorW / 2;
  const doorTop = doorGap.centre - doorH / 2;
  const doorBottom = doorGap.centre + doorH / 2;

  const body = `
    ${label(480, 62, "room to rest", { size: 24, weight: 600 })}
    <path d="${wedgeFill}" fill="${GOLD}" opacity="0.12"/>
    ${duoStroke(topEdge, stroke)}
    ${duoStroke(bottomEdge, stroke)}

    <path d="${eyePath}" fill="none" stroke="${INK}" stroke-width="${(stroke * 0.6).toFixed(2)}" stroke-linejoin="round"/>
    <circle cx="${eyeCx}" cy="${eyeGap.centre.toFixed(1)}" r="${(stroke * 0.7).toFixed(2)}" fill="${INK}"/>
    ${rays}

    <rect x="${doorX.toFixed(1)}" y="${doorTop.toFixed(1)}" width="${doorW}" height="${doorH.toFixed(1)}" fill="none" stroke="${INK}" stroke-width="${(stroke * 0.6).toFixed(2)}"/>
    ${inkStroke(`M${doorCx},${doorTop.toFixed(1)} L${doorCx},${doorBottom.toFixed(1)}`, stroke * 0.4, { opacity: 0.7 })}
    <circle cx="${(doorCx + 18).toFixed(1)}" cy="${doorGap.centre.toFixed(1)}" r="${(stroke * 0.4).toFixed(2)}" fill="${INK}"/>

    ${label(leftX, 470, "judged by the hour", { anchor: "start", size: 22, weight: 600 })}
    ${label(rightX, 470, "judged over months", { anchor: "end", size: 22, weight: 600 })}
  `;

  return frame(width, height, body);
}
