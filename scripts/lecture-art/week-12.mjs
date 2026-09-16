/**
 * Week 12 — Design an institution that permits napping.
 *
 * The synthesis lecture: a workable policy has to survive three constraints
 * at once — chronotype variation, the visibility problem, and measurement —
 * named at the three corners of a triangle. A policy that satisfies all three
 * sits inside it as a single gold marker; the two failure modes the lecture
 * names, the wish and the purchase, sit as small open circles clearly outside
 * the triangle's edges, each failing at least one corner. A faint, low-opacity
 * echo of the course's own stepped hypnogram sits behind the triangle — the
 * same shape the rest of the course drew, closing on it rather than opening a
 * new one.
 */
import { CANVAS_HEIGHT, CANVAS_WIDTH, duoStroke, frame, GOLD, INK, inkStroke, label, marker, strokeWeight } from "./palette.mjs";

export const alt =
  "A two-ink diagram: three straight lines, drawn in the same misregistered gold-and-ink stroke the rest of the course uses for its main line, join to form a triangle, its corners labelled chronotype, visibility and measurement. A single gold-filled circle sits inside the triangle, marking a policy that satisfies all three at once. Two smaller open circles sit well outside the triangle's edges — one above and to the right of the top corner, labelled the wish, and one below its base, labelled the purchase — each marking a policy that fails to hold at least one corner. A faint, barely visible stepped line echoes the course's own hypnogram shape in the background, tying the closing diagram back to the same two-ink line the rest of the course has drawn.";

export function draw(width = CANVAS_WIDTH, height = CANVAS_HEIGHT) {
  const stroke = strokeWeight(height);

  const top = [480, 110];
  const bottomLeft = [220, 420];
  const bottomRight = [740, 420];

  const trianglePath = `M${top[0]},${top[1]} L${bottomLeft[0]},${bottomLeft[1]} L${bottomRight[0]},${bottomRight[1]} Z`;

  const centroid = [
    (top[0] + bottomLeft[0] + bottomRight[0]) / 3,
    (top[1] + bottomLeft[1] + bottomRight[1]) / 3,
  ];

  // A faint reprise of the hypnogram staircase every earlier week drew —
  // background only, low enough opacity that it reads as texture, not a
  // second diagram competing with the triangle in front of it.
  // Kept in the empty upper-left quadrant, running out of frame under the
  // triangle's left edge: down at the base it crossed the corner labels and
  // the canvas edge, which read as a stray mark rather than a reprise.
  const ghostHypnogram = [
    "M40,270",
    "L120,270",
    "L120,215",
    "L200,215",
    "L200,165",
    "L280,165",
    "L280,215",
    "L360,215",
    "L360,270",
    "L430,270",
  ].join(" ");

  const body = `
    ${inkStroke(ghostHypnogram, stroke * 0.8, { opacity: 0.1 })}

    ${duoStroke(trianglePath, stroke * 0.8)}

    ${label(top[0], 88, "measurement", { anchor: "middle", size: 22, weight: 600 })}
    ${label(bottomLeft[0], 452, "chronotype", { anchor: "middle", size: 22, weight: 600 })}
    ${label(bottomRight[0], 452, "visibility", { anchor: "middle", size: 22, weight: 600 })}

    ${marker(centroid[0], centroid[1], stroke * 1.3, { fill: GOLD, stroke: INK, strokeWidth: stroke * 0.6 })}
    ${label(centroid[0], centroid[1] + 42, "the policy", { anchor: "middle", size: 19, weight: 600 })}

    ${marker(820, 150, stroke * 0.85, { fill: "none", stroke: INK, strokeWidth: stroke * 0.45 })}
    ${label(820, 125, "the wish", { anchor: "middle", size: 18, weight: 500, opacity: 0.85 })}

    ${marker(480, 480, stroke * 0.85, { fill: "none", stroke: INK, strokeWidth: stroke * 0.45 })}
    ${label(480, 505, "the purchase", { anchor: "middle", size: 18, weight: 500, opacity: 0.85 })}
  `;

  return frame(width, height, body);
}
