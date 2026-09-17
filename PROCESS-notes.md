# Notes toward PROCESS.md (not the account itself — raw material)

Source: full git log, CLAUDE.md, plan.md, spec/, src/course-config.ts.
Skeleton being answered: `PROCESS.md` as of `cb5391c`.

## "What I built"

- Course description / one-liner lives in `src/course-config.ts` (the
  `description` field) — homepage distributes its clauses rather than
  restating it, per `64af596`.
- Central idea: the site "enacts its own subject" via Nap Mode — dim, enlarged
  text, collapsed nav, self-reverting after `NAP_MINUTES` (20). First built in
  `d74a9f0`.
- Why naps specifically, and why it clears the brief's "niche not reskin"
  test — reasoning captured in `plan.md` under "Why this clears the brief"
  (twelve non-swappable weeks, named against the brief's own examples). This
  section didn't exist until the topic was settled in `fdc9fe3`.
- Topic was not the first idea tried — see turning-point note below. Worth
  deciding whether "what I built" mentions the discarded direction or starts
  clean from naps.

## "How I got here" — the four questions

### 1. Which commit was the actual turning point?

Candidates, pick the one that's actually true for you:

- **Topic pivot.** `f3e6828` committed a full plan for a *different* course
  ("the laugh track course"). `342bae3` explicitly drops it — "the topic is
  being reselected before any content was written, so nothing is sunk" — and
  `fdc9fe3` settles on SLOP1227 Introduction to Naps. If the real turning
  point was realising the first topic wouldn't clear the brief, this range is
  it: `342bae3...fdc9fe3`.
- **Browser-driving becomes the method, not a step.** `505f0db` found three
  real bugs (nav `inert` desync, a `Math.max`/storage race, `inert` surviving
  auto-revert) plus two contrast failures — none of which `pnpm check` could
  ever have gone red on. Every Nap Mode commit after this one (`4aff77c`,
  `d31707b`, `7c09d42`, `f4f8eb8`) carries explicit measured numbers (contrast
  ratios, luminance, pixel dimensions) rather than assertions. If the turning
  point was "stop trusting the check, start measuring the rendered page,"
  it's `505f0db`.
- Both are legitimate; they answer different questions ("turning point in
  what the course is" vs. "turning point in how I verified work"). The
  skeleton asks for one — worth picking based on which mattered more to you.

### 2. Which decision did you deliberately leave out of the harness?

CLAUDE.md carries *process/build* rules, not content decisions — so anything
below is a candidate precisely because it lives only in a commit message:

- `b7c6e7a`: deleting both starter staff photos rather than inventing new
  ones — "invented faces for invented staff were the one piece of the
  template that would have been a fabrication rather than a fiction." A
  values call about what counts as acceptable fiction vs. fabrication, made
  once, not written as a standing rule anywhere.
- `d31707b`: dark mode's dim was deliberately left alone even though light
  mode's dim was deepened, because the measured numbers showed dark's
  reading band was already near-black and going further broke a contrast
  floor. A specific tuning judgment, not a general rule.
- `91859ec`: aviation chosen as "the course's one unambiguous success" — a
  structural/rhetorical decision about how week 12's synthesis argument is
  built, made in content, never surfaced as a harness rule.
- `a3094bd`: choosing to assert course promises against `dist/api/index.json`
  rather than against frontmatter (so the test checks what the course
  *publishes*, not what a page happens to be built from) — a testing
  philosophy decision, stated only in that commit's body.

### 3. Where did you overrule the agent, and was that right?

- `d98e299`: three factual claims already in the harness were wrong (lint
  order relative to build; ship deadline said "before the crit" instead of
  the actual noon-Monday date) — corrected against `package.json` and the
  workflow file rather than trusted as written. Worth saying whether this was
  *you* catching the agent's earlier draft, or the agent catching its own
  earlier claims when asked to audit.
- `f4f8eb8`: the agent's hypothesis (moving the docked bar to `--at-bg-alt`
  would fix low contrast) was measured and found *wrong* — contrast got
  worse, and the 1920 layout turned out to have the same issue independent
  of the dock. The commit keeps the negative result in the file rather than
  silently reverting, which is itself a call about what's worth recording.
- `cb5391c`: two invented commit SHAs (`a1b2c3d`, `e4f5a6b`) shipped in the
  template's example citations were removed rather than left or replaced —
  "the wrong kind of failure to leave lying around... a false citation is
  the thing `check:evidence` exists to keep out." If those were the agent's
  own placeholder text, this is a direct overrule on an integrity point.

### 4. How did you know? (pick one specific claim)

Good candidates because each names the actual measurement, not just "checked
it":

- Contrast: axe-core declines to parse `oklch()` colours (reports
  "incomplete", not a pass), so contrast was verified instead by painting
  each computed colour to a canvas and reading the pixel back — method
  introduced in `505f0db`, reused in `d31707b` and `f4f8eb8`, with exact
  ratios quoted in each commit body.
- Layout at 390: the docked nap bar's reserved space was checked against a
  real iOS `env(safe-area-inset-bottom)` value (34px), not just 0 (what
  desktop Chrome reports) — `7c09d42`. Caught a 26px permanent overlap that
  was invisible at every width tested before that.
- Font scale: `.lead`'s 1.25rem was measured against the *scaled* root inside
  `.at-main`, not the page root, to catch it sitting level with body text
  instead of above it — `505f0db`; homepage sizes re-measured at both
  viewports in `64af596`.
- Structural: twelve weeks / real deck / weights-sum-to-100 spec tests
  (`a3094bd`, `7e7b70a`) were each confirmed to fail first (removed a
  session, repointed a deck, shaved a weight) before being trusted — "a test
  that has never failed is not yet evidence."

## Citation format reminder (from the skeleton)

`[`<sha>`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-yue03084-ce/commit/<sha>)`
— `check:evidence` resolves every SHA cited, so use real ones from
`git log --oneline --reverse` (full list below), not shortened guesses.

---

## Five moments from the git history worth mentioning

1. **`342bae3` → `fdc9fe3`** — a full plan for a different course
   ("laugh track") was written (`f3e6828`) and then deliberately scrapped
   before any content existed, in favour of naps. Clean evidence of a
   direction rejected against the brief rather than just the first idea kept.
2. **`d74a9f0`** — Nap Mode built: the site's one feature that enacts its own
   subject, with a measured OKLCH contrast rationale for every surface it
   touches (not just "looks fine").
3. **`505f0db`** — three real bugs and two contrast failures found only by
   driving the page in a browser; none would ever have turned `pnpm check`
   red. The moment verification stopped meaning "the build is green."
4. **`a3094bd` + `7e7b70a`** — the three spec promises the schema/build
   structurally cannot check (twelve weeks, a real built deck, weights
   summing to 100) written as tests, each confirmed to fail first by
   mutating the build; the weights test deliberately landed a commit later
   than the assessments so no red state was ever committed.
5. **`cb5391c`** — `PROCESS.md` cut back to a bare skeleton, invented
   placeholder SHAs removed, `check:evidence` left deliberately red on
   purpose ("a green gate that means nothing is worse than a red one that
   means what it says").

Full commit list for reference:

```
3d5ca2b Initial commit
3051661 course code: SLOP1227
ce0a96e harness: carry forward from crit 5, restoring what ass1 had
8fc3afb harness: record the four sensor facts crit 4 dropped
f3e6828 plan: the laugh track course, twelve weeks, and the build sequence
cec1de8 harness: A2 requirements, restored rules, and a pointer to the plan
342bae3 plan: drop the topic, keep the parts that don't depend on one
d98e299 harness: audit against the repo, and three factual corrections
5f02baf harness: cut the narration, keep the rules
fdc9fe3 plan: settle the topic — SLOP1227 Introduction to Naps
7732a2a course record: SLOP1227 Introduction to Naps, and Nap Labs
b248c9f week 2: the vertical slice — Nap Lab, lecture, and a real deck
d74a9f0 Nap Mode: the site enacts its own subject
505f0db Nap Mode: three bugs a browser found, and the contrast the build missed
4aff77c plan: record the contrast test Nap Mode still needs
5acc608 weeks 1 and 3-6: the science, then the turn into history
91859ec weeks 7-12: permission, price, and the policy that has to survive an objection
a3094bd spec: the promises the build cannot check
7e7b70a assessment: three pieces summing to 100, and the test that says so
b7c6e7a people: two staff with a reason to be on this course
5032798 policies and 404: the rules a course about sleep actually needs
64af596 home: the course description, distributed rather than restated
7bfaafc nap mode: dock the toggle at phone width, where it sat on the text
73d30ea artwork: the course's own diagram, drawn to survive its two crops
f4f8eb8 nap mode: record the bar-surface measurement that came back negative
cb5391c process: skeleton and questions only — the account is Celeste's to write
2a48b19 indexes: the course's own voice where the template was still talking
29fe9f3 content: week 2 is the first nap, not the first Nap Lab; bios drop the role
d31707b nap mode: make the dim visible, and fade into it instead of cutting
7c09d42 nap mode: the docked bar and the space reserved for it read one input
8f716f8 Add slide decks for all twelve lectures
fada522 Add original two-ink illustrations for each lecture
```
