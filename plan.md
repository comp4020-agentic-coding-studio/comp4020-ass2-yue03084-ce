# A2 build plan — `[LAUGHTER]`

Working document. Not part of the deployed site, not process evidence —
`PROCESS.md` is that, and it is written by me, not the agent.

## The course

| | |
|---|---|
| Code | `SLOP3227` — last three digits fixed by the repo; `3` is a choice, **confirm** |
| Title | `[LAUGHTER]: Manufacturing the Television Audience` (alt: `Canned: …`) |
| Level | 3 (must match the code's first digit) |
| Session | Semester 1, 2027 |
| Teaching period | 2027-02-22 → 2027-05-28 |
| Session label | `Screening` / `Screenings` (the weekly unit of a media course) |
| Tags | `media history`, `sound`, `comedy` (1–3, each 2–24 chars) |

### Why this answers the brief

One idea held for twelve weeks: **the audience is a manufactured object**. Every
week asks who is laughing, who made them, and who benefits. It is narrow enough
that no real university runs it, and it is not COMP4020 with the nouns swapped —
nothing in the week list could be lifted from another course.

The depth is real and it is not all one discipline: technology (the machine),
labour (the studio audience), psychology (does it work), ethics (laughter from
the dead), and production grammar (why three cameras).

## The design problem, and the answer

This is a course about **sound**, and a website is **silent**. That tension is
the most interesting design constraint in the brief, and the answer is not to
add audio — audio is hostile at 390px, hostile to a marker with ten minutes, and
an accessibility problem.

Instead the site adopts the **closed-caption convention for laughter** as its
typographic language: `[LAUGHTER]`, `[SCATTERED CHUCKLES]`, `[AUDIENCE
APPLAUDS]`. This is:

- thematically exact — it is how laughter is written down when it can't be heard
- silent, and text, so accessible by construction
- free to implement, and instantly legible to a marker

### The one component that enacts the subject

**The Laff Box** — Douglass's machine was a keyboard of taped laughs. A grid of
laugh types (titter, chuckle, belly laugh, howl, ripple, boff); clicking one
appends its caption to a track strip below, so you assemble a laugh track as
text. No audio. Works as a grid at 1920 and a stack at 390.

Lands on the home page. It is the thing the marker remembers.

## The twelve weeks

Monday cadence from 2027-02-22, one break week after week 6 (2027-04-05).

| Wk | Date | Screening |
|---|---|---|
| 1 | 02-22 | **Nobody Laughed** — why early television had a silence problem |
| 2 | 03-01 | **The Laff Box** — Douglass's machine, and the monopoly it created ← deck |
| 3 | 03-08 | **A Taxonomy of Laughs** — titters, chuckles, boffs: laughter catalogued |
| 4 | 03-15 | **The Audience as Labour** — warm-up comics, ticket queues, unpaid work |
| 5 | 03-22 | **Three Cameras** — how multi-cam production manufactures its own sound |
| 6 | 03-29 | **Does It Actually Work?** — what the research says about canned laughter |
| 7 | 04-12 | **The Refusal** — mockumentary, the glance to camera, comedy without a cue |
| 8 | 04-19 | **Elsewhere** — British practice, dubbed laughter, laughter in translation |
| 9 | 04-26 | **Dead Air** — the ethics of laughter recorded from people long dead |
| 10 | 05-03 | **Streaming Silence** — the decline, and the multi-cam holdouts |
| 11 | 05-10 | **Synthetic Crowds** — empty stadiums, virtual audiences, generated laughter |
| 12 | 05-17 | **The Last Laugh** — what the audience was for |

Sessions carry the substance. Lectures stay short and link out — that is the
template's own instruction, and it is the "one fact, one place" rule applied to
content.

## Assessment — sums to 100

| Task | Wk | Due | Weight |
|---|---|---|---|
| The Laugh Log | 5 | 2027-03-26 | 20 |
| Track Analysis | 8 | 2027-04-23 | 35 |
| Build an Audience | 12 | 2027-05-28 | 45 |

Timezone detail: March dates are AEDT (`+11:00`), April and May are AEST
(`+10:00`) — DST ends 2027-04-04.

## Checks to add

**None of these exist yet.** `spec/` currently holds exactly two files:
`data-integrity.test.ts` (shipped; dates inside the teaching period) and
`invariants.test.ts` (per-page HTML invariants). The three below are work to do,
in a new `spec/course-contract.test.ts`, each landing **after** the content it
asserts so nothing is ever committed red.

`spec/README.md` asks for them in these words: *"Turning the week's published
spec into tests is your work, not the template's. Some spec lines are
mechanically checkable — assert those here […] test the **contracts** — what the
page must do, not how you built it."*

### Read the API, not the source

`data-integrity.test.ts` doesn't parse frontmatter — it reads the built
`dist/api/index.json` and filters `api.nodes` by `node.type`. All three tests
below follow it. The API is what this course actually publishes; frontmatter is
only its raw material. Asserting against the API is what makes these tests
survive a change of content structure, which is the contract-not-implementation
point `spec/README.md` makes.

1. **twelve weeks, no gaps or duplicates** — `type === "sessions"`, collect
   `meta.week`, assert the set is exactly 1–12. (The schema caps `week` at 12
   but permits three sessions in week 4 and none in week 9.)
2. **assessment weights sum to 100** — `type === "assessments"`, sum
   `meta.weight`. The schema does *not* check this: its `weightedMarking` refine
   only validates that the criteria *within* one assessment sum to 100. Nothing
   anywhere looks across the course. This is the one the brief names and the
   codebase genuinely leaves open.
3. **a real deck, linked** — some `type === "lectures"` node has `meta.slides`,
   and the deck it names exists in the build (`dist/decks/<name>/index.html`).
   Presence of the field alone would pass while pointing at nothing.

Each retires one bullet in `CLAUDE.md`'s "This deliverable's requirements" —
those three carry that expiry condition in writing. Deleting them when the test
lands is part of the work, not tidying up afterwards.

## Build sequence

Commits are the process record and process is 45% of the mark, so this is
sequenced as commits, not as tasks.

1. **Course record** — `course-config.ts` (code, title, level, dates, tags,
   description), `sessionLabels` → Screenings. Removes one starter marker.
2. **Vertical slice: week 2, end to end** — session + lecture + the real deck +
   the `LaughCue` caption component. One week fully right before twelve weeks
   half right. This is the incremental rule: prove the shape, then scale.
3. **Weeks 1, 3–6** — sessions and short lectures.
4. **Weeks 7–12.**
5. **Spec test: twelve weeks** — only now, because only now can it be green.
   The test lands *after* the content it asserts, never before.
6. **Assessments** ×3, then **spec test: weights sum to 100** — same order, same
   reason.
7. **Spec test: deck linked and built** — the deck exists from step 2, so this
   one could have landed earlier; it is here because it also asserts the built
   output, which means it needs a build that contains everything.
8. **People** — rewrite the two starter staff as this course's teaching team.
9. **Policies + 404** — `[SILENCE]` on the 404 page is free and on-theme.
10. **Home page + the Laff Box.**
11. **Card image** — `check:evidence` fails while the placeholder hash stands.
    Author the `[LAUGHTER]` motif as SVG at 1200×630, rasterise, replace.
12. **Starter sweep** — 12 files currently carry `STARTER_CONTENT`; all must go.
13. **Viewport pass** — 1920 and 390, via `agent-browser`, on the built site.
14. **Ship** — public with a day's margin, then open the live URL and load a
    real page.

## Discipline for this build

**No date, weight or week number is ever written in prose.** They live in
`course-config.ts` and in each entry's frontmatter, and pages read them. A
course site states the same facts across twenty-odd pages; every one of those
is a fact with two possible homes, and two homes is a site that eventually
contradicts itself in front of a marker.

## Not the agent's to write

`PROCESS.md` (400–600 words) is my own first-person account. The agent may ask
me questions and lay out headings; it does not draft the substance. Questions to
answer near the end:

- which commit was the actual turning point, and why
- which decision I deliberately left out of the harness
- what the `CLAUDE.md` archaeology (crit 4's silent deletions) actually changed
  about how I work

## Risks

- **Content volume** — 12 sessions + 12 lectures + 3 assessments is the bulk of
  the work. Lectures being short by design is what makes it fit.
- **The Laff Box at 390** — a grid component is where fixed heights bite. Measure
  `scrollHeight` against `clientHeight`, don't eyeball it.
- **Card image** — easy to leave until last and then discover `check:evidence`
  is red at ship time. It is step 11, not step 14, on purpose.
