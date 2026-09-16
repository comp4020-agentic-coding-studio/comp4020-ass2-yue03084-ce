# A2 build plan

Working document. Not part of the deployed site, and not process evidence ---
`PROCESS.md` is that, and it is written by me, not the agent.

> **Due noon, Monday 21 September 2026.** Everything below is sized against
> that, not against a comfortable week.

## Topic: Introduction to Naps

**The nap is a biological need that modern work schedules erased.** The course
studies its science, its history, and its return. Every week connects back to
that line.

### Why this clears the brief

- **Niche, not a reskin.** No real university runs twelve weeks on daytime
  sleep, and the subject is deep enough to carry them: sleep architecture,
  caffeine pharmacology, chronobiology, labour history, anthropology, public
  health, wearable data, memory consolidation, institutional design.
- **Twelve distinguishable weeks.** The brief's honest test. Week 5 (industrial
  timekeeping killed the nap) and week 10 (how bad sleep-tracker data is) cannot
  be swapped for each other.
- **The site enacts its subject.** Nap Mode --- see below. Layout and components
  only; the Slop brand colours and logo are fixed.

### The twelve weeks

Each week is one lecture (short, links out) plus one Nap Lab (the substance).

| Wk | Title | Field |
|---|---|---|
| 1 | What is a nap --- sleep stages and the 90-minute cycle | sleep science |
| 2 | Twenty minutes or ninety --- sleep inertia, and why the middle is worst | neuroscience |
| 3 | The coffee nap --- caffeine pharmacology and the 15-minute window | pharmacology |
| 4 | Why 2pm --- circadian rhythm and the post-lunch dip | chronobiology |
| 5 | How the Industrial Revolution killed the nap --- clocks, factories, segmented sleep | history |
| 6 | Siesta, 午休, inemuri --- three nap regimes and what each permits | anthropology |
| 7 | The politics of the office nap --- who is allowed to be seen sleeping | labour sociology |
| 8 | Nap pods and sleep as a product --- the commodification of rest | design / business |
| 9 | Infants, elders, shift workers --- who needs naps most, and who gets them | public health |
| 10 | Measuring the nap --- wearables, trackers, and how bad the data is | data |
| 11 | Naps and memory --- consolidation, and whether to sleep before or after studying | cognitive science |
| 12 | Design an institution that permits napping --- synthesis | design |

### Nap Mode --- the feature that carries the idea

A toggle in the site header. On: the page dims, body text enlarges, the
navigation collapses, and the site returns to normal **by itself after twenty
minutes** --- Week 2's ideal nap length.

Settled before any code, because both halves have bitten this repo's rules
before:

- **When it updates:** on click, *and on every page load*. This is a multi-page
  Astro site, so a boolean in memory dies at the first navigation. What persists
  is an **expiry timestamp**; each page load applies Nap Mode if `now < expiry`
  and sets a timer for the remainder.
- **What must not change:** every link still works; the collapsed navigation
  stays keyboard-reachable; with JS disabled the site is simply the ordinary
  site; `astro-theme-university`'s a11y pass stays at zero violations; the
  dimming never drops text contrast (brand colours are fixed); the twenty-minute
  revert does not steal focus.
- **Twenty minutes is one constant**, read by the toggle and by Week 2's page.
  Two copies of that number is exactly the "one fact, two homes" failure
  `CLAUDE.md` names.

## Course identity — settled

| | |
|---|---|
| Code | `SLOP1227` --- the three digits arrived with the repo; only the level digit was free |
| Level | 1 --- must equal the code's first digit |
| Title | Introduction to Naps |
| Session / year | Semester 1, 2027 (already in `course-config.ts`) |
| Teaching period | 2027-02-22 → 2027-05-28 (already in `course-config.ts`) |
| Session label | **Nap Lab / Nap Labs** --- `sessionLabels` in `src/site-config.ts`. The collection and the URL stay `sessions` |
| Description | 80–300 chars, schema-enforced --- so the homepage paragraph is *too long for this field*. Condense for `courseMeta.description`; the full paragraph is homepage body copy |
| Tags | `sleep`, `rest`, `chronobiology` |

### The week cadence

Mondays from 2027-02-22, with a **two-week** mid-semester break after week 6.
That is what makes the existing `endDate` land exactly: week 12 is 2027-05-24
and its Friday is 2027-05-28, the last day of the teaching period. A one-week
break would end teaching on 05-21 and leave a stray week in `course-config.ts`.

| Wk | Date | | Wk | Date |
|---|---|---|---|---|
| 1 | 02-22 | | 7 | 04-19 |
| 2 | 03-01 | | 8 | 04-26 |
| 3 | 03-08 | | 9 | 05-03 |
| 4 | 03-15 | | 10 | 05-10 |
| 5 | 03-22 | | 11 | 05-17 |
| 6 | 03-29 | | 12 | 05-24 |

Break: 2027-04-05 and 2027-04-12. Timezone detail for assessment `due` values:
up to 2027-04-04 is AEDT (`+11:00`), after it AEST (`+10:00`) --- DST ends that
Sunday.

### Assessments (sum to 100, which is one of the three spec tests)

| Assessment | Weight | Due | Wk |
|---|---|---|---|
| Nap Log --- two-week nap diary plus an analysis of the data | 30% | 2027-04-02 (AEDT) | 6 |
| Cultural Case Study --- 1500 words on one culture's nap regime | 30% | 2027-04-30 (AEST) | 8 |
| Nap Policy Proposal --- a nap policy for a real institution, and its defence | 40% | 2027-05-28 (AEST) | 12 |

All three fall inside the teaching period, which `data-integrity.test.ts`
already enforces.

Sessions carry the substance; lectures stay short and link out. That is the
template's own instruction and it is "one fact, one place" applied to content ---
it is also what makes 12 + 12 entries feasible rather than double work.

## Checks to add

**None of these exist yet.** `spec/` holds exactly two files:
`data-integrity.test.ts` (shipped; dates inside the teaching period) and
`invariants.test.ts` (per-page HTML invariants). The four below go in a new
`spec/course-contract.test.ts`, each landing **after** the content it asserts so
nothing is ever committed red.

These are not optional. The spec lists **"your own checks in `spec/`, protecting
the promises your course makes that the build cannot"** among its fixed
requirements, and `spec/README.md` asks that they test *contracts* --- "what the
page must do, not how you built it".

### Read the API, not the source

`data-integrity.test.ts` doesn't parse frontmatter --- it reads the built
`dist/api/index.json` and filters `api.nodes` by `node.type`. The first three
tests below follow it. The API is what the course actually publishes;
frontmatter is only its raw material, so asserting against the API is what makes
these tests survive a change of content structure. The fourth is about rendered
pages, so it reads `dist/**/*.html` the way `invariants.test.ts` does.

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
4. **Nap Mode reaches every page** --- the toggle is in the built HTML of every
   page of the site (decks excluded: a deck carries no site chrome, which
   `invariants.test.ts` already encodes). This is the promise the course makes
   that the build cannot check: a header component silently dropped from one
   layout is invisible to types, lint and a11y alike, and the one page missing
   it would be the one a marker opens.

The first three retire a bullet each in `CLAUDE.md` → "This deliverable's
requirements"; those carry that expiry condition in writing. Deleting them when
the test lands is part of the work.

## Build sequence

Commits are the process record and process is 45% of the mark, so this is
sequenced as commits, not as tasks.

1. **Course record** --- `course-config.ts` (title, description, tags) and
   `sessionLabels` → Nap Lab. Clears the first `STARTER_CONTENT` marker.
2. **Vertical slice: week 2, end to end** --- Nap Lab + lecture + the real deck
   (`src/decks/week-02.deck.mdx`, replacing the starter `week-01.deck.mdx`).
   Week 2 rather than week 1 because "twenty minutes or ninety" is the fact Nap
   Mode enacts, so content and feature are settled together. One week fully
   right before twelve weeks half right.
3. **Nap Mode** --- the constant, the toggle, the persistence, the revert. Its
   contract is written above; build against that, not against a fresh idea.
4. **Weeks 1, 3–6.**
5. **Weeks 7–12.**
6. **Spec test: twelve weeks** --- only now, because only now can it be green.
   The test lands *after* the content it asserts, never before.
7. **Assessments** ×3, then **spec test: weights sum to 100** --- same order,
   same reason.
8. **Spec tests: deck linked and built, and Nap Mode on every page** --- both
   assert built output, so they want a build containing everything.
9. **People** --- rewrite the two starter staff, and **delete both `.avif`
   portraits** along with their `photo`/`photoAlt` frontmatter. `photo` is
   optional in the schema, and `check-evidence.ts` says in its own comment that
   a deleted file passes: an image-free treatment is a design decision. Giving
   invented staff invented faces is the thing worth avoiding.
10. **Policies + 404.**
11. **Home page** --- the full course paragraph as body copy, since it is far
    longer than `description`'s 300-char ceiling.
12. **Card image** --- `check:evidence` fails while `src/assets/images/card.png`
    still hashes to the shipped placeholder. Author at 1200×630 and replace.
    `hero-home.avif` is on the same list.
13. **Starter sweep** --- 12 files carry `STARTER_CONTENT`; all must go, and
    `check:evidence` greps `src/` for them.
14. **Viewport pass** --- 1920 and 390, on the built site, Nap Mode on and off.
    `agent-browser` is not installed in this repo; install it or use another
    real browser.
15. **Ship** --- public with a day's margin, then open the live Pages URL and
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
  at ship time. It is step 12, not step 15, on purpose.
- **Nap Mode is the one piece with no check behind it until step 8**, and it is
  the piece a marker remembers. It gets built early (step 3) for that reason,
  not late as a flourish.
