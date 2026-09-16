/**
 * Week 3 — The coffee nap.
 *
 * The lecture's claim, and the assignment brief's own example: caffeine
 * takes roughly twenty to thirty minutes to reach a useful concentration in
 * the bloodstream — almost exactly as long as a short nap takes to run its
 * course. Drink first, then sleep: the order is the intervention, because
 * the nap clears some adenosine right as the caffeine arrives to occupy the
 * receptors it would otherwise have bound. Drawn as two curves sharing one
 * time axis — a rising caffeine-concentration curve as the primary line, a
 * short nap's sleep-depth dip as a secondary line beneath it — placed so
 * they visibly cross at the twenty-to-thirty-minute mark, which is the
 * entire joke of the lecture.
 */
import { CANVAS_HEIGHT, CANVAS_WIDTH, duoStroke, frame, goldBand, INK, inkStroke, label, marker, strokeWeight } from "./palette.mjs";

export const alt =
  "A two-ink diagram of two curves sharing one time axis running left to " +
  "right from 'asleep or awake' at zero minutes onward. The thicker primary " +
  "line is a caffeine-concentration curve: flat and low at the start, " +
  "rising smoothly through the middle of the chart, levelling off high " +
  "toward the right and labelled caffeine concentration. A thinner secondary " +
  "line dips down from 'awake' into a shallow trough labelled light sleep " +
  "and climbs back to 'awake' well before the caffeine curve levels off, " +
  "labelled short nap, with a faint gold band behind it holding the whole " +
  "dip, from closing the eyes to waking. The two lines cross once, partway up the caffeine curve's " +
  "rise, at a point marked with a small ringed circle and labelled 20 to 30 " +
  "minutes — the moment the lecture calls the whole trick.";

export function draw(width = CANVAS_WIDTH, height = CANVAS_HEIGHT) {
  const stroke = strokeWeight(height);

  const X0 = 80; // t = 0
  const X_END = 880; // t = 40 minutes, at 20px per minute
  const PX_PER_MIN = (X_END - X0) / 40;
  const minuteToX = (min) => X0 + min * PX_PER_MIN;

  const AWAKE_Y = 150;
  const BASELINE_Y = 440;

  // The short nap: awake, down into a shallow trough of light sleep, back to
  // awake by about the 21-minute mark. Never reaches slow-wave sleep — that
  // is the whole point of a short nap, per weeks 1 and 2.
  const napEndX = minuteToX(21);
  const napControlY = 340;
  const napPath = `M${X0},${AWAKE_Y} Q${minuteToX(9)},${napControlY} ${napEndX},${AWAKE_Y}`;

  // A quadratic sits half way to its control point, so the trough is here and
  // not at napControlY — the gold band has to be sized off this, or it floats
  // below a dip it is supposed to be marking.
  const napTroughX = 0.25 * X0 + 0.5 * minuteToX(9) + 0.25 * napEndX;
  const napTroughY = 0.5 * AWAKE_Y + 0.5 * napControlY;
  const bandBottom = napTroughY + 35;

  // Caffeine concentration: low and flat at the start, climbing steeply
  // through the 10-21 minute window to pass through the exact point (in
  // time and in height) where the nap curve above finishes waking, then
  // continuing up to a plateau. The two C segments share that on-curve
  // point, so the crossing is not eyeballed — the path is built through it.
  const crossX = napEndX;
  const crossY = AWAKE_Y;
  const caffeinePath =
    `M${X0},${BASELINE_Y} C${minuteToX(11)},${BASELINE_Y - 10} ${minuteToX(15)},260 ${crossX},${crossY} ` +
    `C${minuteToX(27)},70 ${minuteToX(32)},55 ${X_END},50`;

  const body = `
    ${inkStroke(`M${X0},${BASELINE_Y} L${X_END},${BASELINE_Y}`, stroke * 0.4, { opacity: 0.5 })}
    ${label(X0, BASELINE_Y + 30, "0 min", { anchor: "start", size: 15, opacity: 0.6 })}
    ${label(X_END, BASELINE_Y + 30, "40 min", { anchor: "end", size: 15, opacity: 0.6 })}

    ${goldBand(X0, AWAKE_Y, napEndX - X0, bandBottom - AWAKE_Y, { opacity: 0.16 })}

    ${inkStroke(napPath, stroke * 0.55, { opacity: 0.8 })}
    ${label(X0, AWAKE_Y - 16, "awake", { anchor: "start", size: 16, opacity: 0.75 })}
    ${label(napTroughX, napTroughY + 24, "light sleep", { size: 16, opacity: 0.75 })}
    ${label(napTroughX, bandBottom + 26, "short nap", { size: 18, weight: 600, opacity: 0.85 })}

    ${duoStroke(caffeinePath, stroke)}
    ${label(X_END, 30, "caffeine concentration", { anchor: "end", size: 18, weight: 600 })}

    ${marker(crossX, crossY, stroke * 1.1, { fill: "#f7f3ea", stroke: INK, strokeWidth: stroke * 0.45 })}
    ${label(crossX - 18, crossY - 22, "20–30 min", { anchor: "end", size: 17, weight: 700 })}
    ${label(crossX - 18, crossY - 2, "drink first, then sleep", { anchor: "end", size: 15, weight: 500, opacity: 0.8 })}
  `;

  return frame(width, height, body);
}
