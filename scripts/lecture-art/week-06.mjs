/**
 * Week 6 — Siesta, 午休, inemuri.
 *
 * The lecture's claim: three cultures kept daytime sleep, but not the same
 * arrangement of it, and the difference sits on two axes — private to
 * public, and unscheduled to scheduled. Siesta is a private gap taken at
 * home, unscheduled by the employer. 午休 (wǔxiū) is collective and written
 * into the institution's own rhythm — scheduled, and public enough to happen
 * at the desk without being hidden. Inemuri is dozing in full view but never
 * on the clock — public and unscheduled, tolerated only as a sign of
 * overwork. Drawn as a plain ink cross with the two axes labelled at their
 * ends, and three points placed on it: wǔxiū picked out with the diagram's
 * one gold-and-ink mark, siesta and inemuri in plain ink.
 */
import { CANVAS_HEIGHT, CANVAS_WIDTH, duoStroke, frame, GOLD, INK, inkStroke, label, marker, strokeWeight } from "./palette.mjs";

export const alt =
  "A two-ink diagram of two crossing axes on plain paper: a horizontal line " +
  "labelled private at its left end and public at its right, and a vertical " +
  "line labelled scheduled at its top and unscheduled at its bottom, meeting " +
  "at the centre. Three labelled circles sit on the cross. Toward the " +
  "private, unscheduled corner, a plain ink circle is labelled siesta. Near " +
  "the top, close to the scheduled end and roughly centred left-to-right, a " +
  "circle drawn with a gold echo behind its ink outline — the diagram's one " +
  "emphasised mark — is labelled wǔxiū. Toward the public, unscheduled " +
  "corner, a second plain ink circle is labelled inemuri.";

export function draw(width = CANVAS_WIDTH, height = CANVAS_HEIGHT) {
  const stroke = strokeWeight(height);

  const originX = 480;
  const originY = 290;
  const axisTop = 120;
  const axisBottom = 460;
  const axisLeft = 160;
  const axisRight = 800;

  const siesta = [280, 400];
  const wuxiu = [540, 168];
  const inemuri = [700, 400];

  const wuxiuR = stroke * 1.3;
  const dx = (stroke * 0.9).toFixed(2);
  const dy = (stroke * 1.1).toFixed(2);

  const body = `
    ${inkStroke(`M${axisLeft},${originY} L${axisRight},${originY}`, stroke * 0.55, { opacity: 0.8 })}
    ${inkStroke(`M${originX},${axisTop} L${originX},${axisBottom}`, stroke * 0.55, { opacity: 0.8 })}

    ${label(axisLeft, originY + 34, "private", { anchor: "start", size: 21, weight: 600, opacity: 0.85 })}
    ${label(axisRight, originY + 34, "public", { anchor: "end", size: 21, weight: 600, opacity: 0.85 })}
    ${label(originX, axisTop - 22, "scheduled", { anchor: "middle", size: 21, weight: 600, opacity: 0.85 })}
    ${label(originX, axisBottom + 38, "unscheduled", { anchor: "middle", size: 21, weight: 600, opacity: 0.85 })}

    ${marker(siesta[0], siesta[1], stroke * 1.1)}
    ${label(siesta[0], siesta[1] + 36, "siesta", { anchor: "middle", size: 22, weight: 600 })}

    <circle cx="${(wuxiu[0] + Number(dx)).toFixed(1)}" cy="${(wuxiu[1] + Number(dy)).toFixed(1)}" r="${wuxiuR.toFixed(1)}" fill="none" stroke="${GOLD}" stroke-width="${(stroke * 0.6).toFixed(2)}"/>
    <circle cx="${wuxiu[0]}" cy="${wuxiu[1]}" r="${wuxiuR.toFixed(1)}" fill="${INK}" stroke="${INK}" stroke-width="${(stroke * 0.6).toFixed(2)}"/>
    ${label(wuxiu[0] + 34, wuxiu[1] + 6, "wǔxiū", { anchor: "start", size: 22, weight: 600 })}

    ${marker(inemuri[0], inemuri[1], stroke * 1.1)}
    ${label(inemuri[0], inemuri[1] + 36, "inemuri", { anchor: "middle", size: 22, weight: 600 })}
  `;

  return frame(width, height, body);
}
