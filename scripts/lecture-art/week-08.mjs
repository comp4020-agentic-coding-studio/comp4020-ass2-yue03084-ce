/**
 * Week 8 — Nap pods and sleep as a product.
 *
 * The lecture's claim: institutions buy a one-time object instead of making
 * a continuous, recurring change — shorter shifts, later starts. A
 * workplace of four hundred buys two pods; the arithmetic is the policy.
 *
 * Drawn as two devices side by side. On the left, a compact grid of dots
 * stands for the whole workforce — plain ink, anonymous, all but two of
 * them. Those two sit beside a single capsule (the pod), picked out in
 * gold, the only dots the object actually reaches. On the right, a
 * timeline shows the alternative that was not bought: a bar repeating
 * evenly across the whole day, fading at both edges to say it keeps going
 * — a continuous change measured against the pod's single, static shape.
 */
import { CANVAS_HEIGHT, CANVAS_WIDTH, duoStroke, frame, GOLD, INK, inkStroke, label, strokeWeight } from "./palette.mjs";

export const alt =
  "A two-ink diagram split in two. On the left, a tight square grid of small ink dots — fifteen rows of fifteen, two hundred and twenty-five in all — stands for an entire workforce. Two dots at the grid's corner are drawn larger and filled gold instead of ink, and beside them sits a single rounded capsule shape, outlined in the same gold-and-ink misregistered line as the homepage hero: the pod, and the only two people it reaches. A caption under the grid reads 'the floor'; a caption under the capsule reads 'bought once'. On the right, a horizontal row of evenly spaced ink bars runs the width of the frame above a baseline, fading toward both edges to suggest it continues off the page, captioned 'shorter shifts, every day' — a continuous change set against the pod's isolated, static shape.";

export function draw(width = CANVAS_WIDTH, height = CANVAS_HEIGHT) {
  const stroke = strokeWeight(height);

  // The workforce grid: fifteen columns by fifteen rows of plain ink dots.
  const cols = 15;
  const rows = 15;
  const gridX0 = 90;
  const gridY0 = 84;
  const spacing = 20;
  const dotR = 3.4;
  const highlightR = 6.5;

  // The two dots the pod actually reaches: the grid's bottom-right corner.
  const highlighted = new Set([`${rows - 1}-${cols - 1}`, `${rows - 1}-${cols - 2}`]);

  let dots = "";
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const x = gridX0 + c * spacing;
      const y = gridY0 + r * spacing;
      if (highlighted.has(`${r}-${c}`)) {
        dots += `<circle cx="${x}" cy="${y}" r="${highlightR}" fill="${GOLD}" stroke="${INK}" stroke-width="1.5"/>`;
      } else {
        dots += `<circle cx="${x}" cy="${y}" r="${dotR}" fill="${INK}" opacity="0.55"/>`;
      }
    }
  }

  const gridRight = gridX0 + (cols - 1) * spacing;
  const gridBottom = gridY0 + (rows - 1) * spacing;

  // The pod: a capsule (a rounded rectangle with two semicircular caps),
  // sitting just off the grid's marked corner.
  const podCx = gridRight + 92;
  const podCy = gridBottom;
  const podW = 108;
  const podH = 40;
  const podR = podH / 2;
  const px1 = podCx - podW / 2 + podR;
  const px2 = podCx + podW / 2 - podR;
  const podTop = podCy - podR;
  const podBottom = podCy + podR;
  const podPath = `M${px1},${podTop} L${px2},${podTop} A${podR},${podR} 0 0 1 ${px2},${podBottom} L${px1},${podBottom} A${podR},${podR} 0 0 1 ${px1},${podTop} Z`;

  // The recurring change: a bar repeated evenly across a day-long axis,
  // fading at both edges to read as ongoing rather than framed.
  const axisY = 470;
  const axisLeft = 560;
  const axisRight = 880;
  const barCount = 9;
  const barW = 22;
  const barGap = (axisRight - axisLeft - barCount * barW) / (barCount - 1);
  let bars = "";
  for (let i = 0; i < barCount; i += 1) {
    const x = axisLeft + i * (barW + barGap);
    const edgeFade = Math.min(1, Math.min(i, barCount - 1 - i) / 2.2 + 0.35);
    bars += `<rect x="${x.toFixed(1)}" y="${(axisY - 34).toFixed(1)}" width="${barW}" height="30" fill="${INK}" opacity="${(0.5 * edgeFade).toFixed(2)}"/>`;
  }

  const body = `
    ${label(gridX0, 60, "the floor", { anchor: "start", size: 22, weight: 600 })}
    ${dots}
    ${duoStroke(podPath, stroke * 0.7)}
    ${label(podCx, podTop - 18, "bought once", { anchor: "middle", size: 18, weight: 600 })}

    ${inkStroke(`M${axisLeft},${axisY} L${axisRight},${axisY}`, stroke * 0.4, { opacity: 0.6 })}
    ${bars}
    ${label(axisLeft, axisY + 34, "shorter shifts, every day", { anchor: "start", size: 18, weight: 600, opacity: 0.85 })}
    ${label(axisLeft, 90, "the change not bought", { anchor: "start", size: 22, weight: 600, opacity: 0.85 })}
  `;

  return frame(width, height, body);
}
