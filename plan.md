# A2 build plan

Working document. Not part of the deployed site, and not process evidence ---
`PROCESS.md` is that, and it is written by me, not the agent.

> **Due noon, Monday 21 September 2026.** Everything below is sized against
> that, not against a comfortable week.

## Topic: not yet chosen

The previous topic was dropped before any content was written, so nothing here
is sunk cost --- no content files, no components, no config. The sections below
are the parts of the plan that do not depend on which topic wins.

When a topic is chosen, record it in **two** places: a sentence or two in
`CLAUDE.md` (loaded into every session automatically) and the detail here
(loaded into none). See `CLAUDE.md` → "Keeping this file honest".

### What the topic has to clear

- **Niche enough that no real university runs it, deep enough to fill a
  semester** --- one idea held all the way through, not COMP4020 with the nouns
  swapped. This is the 35% "response to the brief" criterion and no check can
  catch a course that is complete but thin.
- **Twelve weeks of genuinely different material.** The honest test: can I write
  twelve week titles right now, that a reader could tell apart? If week 7 and
  week 9 sound interchangeable, the topic is too narrow to survive.
- **Something the site itself can enact.** The strongest single move available
  is a site that demonstrates its own subject in a way a marker remembers after
  ten minutes. This is worth more than a visual redesign --- and the Slop brand
  colours and logo are fixed anyway, so layout and components are the only
  things actually available to change.

## Course identity — to fill in

| | |
|---|---|
| Code | `SLOP?227` --- spec: **"keeps the three digits your repo arrived with"**. Only the first digit (level) is free |
| Level | must equal the code's first digit; schema allows 1, 2, 3, 4, 6, 8 |
| Title | ≤100 chars |
| Session / year | Semester 1, 2027 (already in `course-config.ts`) |
| Teaching period | 2027-02-22 → 2027-05-28 (already in `course-config.ts`) |
| Session label | `sessionLabels` in `src/site-config.ts` --- rethemeable (Studios, Screenings, Labs…) |
| Description | 80–300 chars, schema-enforced |
| Tags | 1–3, each 2–24 chars |

### The week cadence (topic-independent)

Mondays from 2027-02-22, one break week after week 6. This fits the existing
teaching period without touching `course-config.ts`:

| Wk | Date | | Wk | Date |
|---|---|---|---|---|
| 1 | 02-22 | | 7 | 04-12 |
| 2 | 03-01 | | 8 | 04-19 |
| 3 | 03-08 | | 9 | 04-26 |
| 4 | 03-15 | | 10 | 05-03 |
| 5 | 03-22 | | 11 | 05-10 |
| 6 | 03-29 | | 12 | 05-17 |

Break: 2027-04-05. Timezone detail for assessment `due` values: March is AEDT
(`+11:00`), April and May are AEST (`+10:00`) --- DST ends 2027-04-04.

Sessions carry the substance; lectures stay short and link out. That is the
template's own instruction and it is "one fact, one place" applied to content ---
it is also what makes 12 + 12 entries feasible rather than double work.

## Checks to add

**None of these exist yet.** `spec/` holds exactly two files:
`data-integrity.test.ts` (shipped; dates inside the teaching period) and
`invariants.test.ts` (per-page HTML invariants). The three below go in a new
`spec/course-contract.test.ts`, each landing **after** the content it asserts so
nothing is ever committed red.

These are not optional. The spec lists **"your own checks in `spec/`, protecting
the promises your course makes that the build cannot"** among its fixed
requirements, and `spec/README.md` asks that they test *contracts* --- "what the
page must do, not how you built it".

### Read the API, not the source

`data-integrity.test.ts` doesn't parse frontmatter --- it reads the built
`dist/api/index.json` and filters `api.nodes` by `node.type`. All three tests
below should follow it. The API is what the course actually publishes;
frontmatter is only its raw material, so asserting against the API is what makes
these tests survive a change of content structure.

1. **Twelve weeks, no gaps or duplicates** --- `type === "sessions"`, collect
   `meta.week`, assert the set is exactly 1–12. The schema caps `week` at 12 but
   permits three sessions in week 4 and none in week 9, so "nothing exceeds 12"
   is not the assertion.
2. **Assessment weights sum to 100** --- `type === "assessments"`, sum
   `meta.weight`. The schema does *not* check this: its `weightedMarking` refine
   only validates that criteria *within* one assessment sum to 100, never across
   the course. A real gap, not a redundant test.
3. **A real deck, linked** --- some `type === "lectures"` node has `meta.slides`,
   *and* the deck it names exists in the build (`dist/decks/<name>/index.html`).
   Field presence alone passes while pointing at nothing.

Each retires one bullet in `CLAUDE.md` → "This deliverable's requirements";
those carry that expiry condition in writing. Deleting them when the test lands
is part of the work.

## Build sequence

Commits are the process record and process is 45% of the mark, so this is
sequenced as commits, not as tasks.

1. **Course record** --- `course-config.ts` (code, title, level, description,
   tags) and `sessionLabels`. Clears the first `STARTER_CONTENT` marker.
2. **Vertical slice: one week, end to end** --- session + lecture + the real
   deck + whatever component carries the site's visual idea. One week fully
   right before twelve weeks half right.
3. **Weeks 1, 3–6.**
4. **Weeks 7–12.**
5. **Spec test: twelve weeks** --- only now, because only now can it be green.
   The test lands *after* the content it asserts, never before.
6. **Assessments** ×3, then **spec test: weights sum to 100** --- same order,
   same reason.
7. **Spec test: deck linked and built** --- last of the three because it also
   asserts built output, so it wants a build containing everything.
8. **People** --- rewrite the two starter staff.
9. **Policies + 404.**
10. **Home page + the component that carries the idea.**
11. **Card image** --- `check:evidence` fails while `src/assets/images/card.png`
    still hashes to the shipped placeholder. Author at 1200×630 and replace.
12. **Starter sweep** --- 12 files carry `STARTER_CONTENT`; all must go, and
    `check:evidence` greps `src/` for them.
13. **Viewport pass** --- 1920 and 390, on the built site. `agent-browser` is
    not installed in this repo; install it or use another real browser.
14. **Ship** --- public with a day's margin, then open the live Pages URL and
    load a real page. Nothing in `check` looks at the live URL.

## Discipline for this build

**No date, weight or week number is ever written in prose.** They live in
`course-config.ts` and in each entry's frontmatter, and pages read them. This is
settled in `CLAUDE.md` under "One fact, one piece of code" --- decided before any
content exists, because the alternative is twelve files of rework.

## Not the agent's to write

`PROCESS.md` --- spec: **"runs to 400–600 words"**, **"written by you for a
reader"**. The agent may ask questions and lay out headings; it does not draft
the substance. Questions to answer near the end:

- which commit was the actual turning point, and why
- which decision I deliberately left out of the harness
- what auditing `CLAUDE.md` against the repo actually changed --- three of its
  factual claims were wrong, and none of them were caught by a check

## Risks

- **Time.** The deadline is days away and the content is the bulk of the work:
  12 sessions + 12 lectures + 3 assessments + people + policies + home. Current
  progress is measurable --- `dist/api/index.json` has **9 nodes** today and
  should end in the low thirties.
- **Content volume vs. depth.** Twelve thin weeks fail the 35% criterion as
  surely as eleven good ones fail the spec. Lectures being short *by design* is
  what buys the depth.
- **Anything with a fixed height** --- measure `scrollHeight` against
  `clientHeight` at 390, don't eyeball it. See `CLAUDE.md`.
- **Card image** --- easy to leave until last and then find `check:evidence` red
  at ship time. It is step 11, not step 14, on purpose.
