# COMP4020 Assignment 2 harness

**Due noon, Monday 21 September 2026.** Worth 20% of the course.

Carried forward from crit 5, with the rules A1 had and later weeks lost. The
platform under it is fixed and documented in `README.md`; the
[course website](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/)
publishes this deliverable's brief and spec. The brief poses the problem, the
spec is the fixed contract. Read both before you plan or build.

Rules here carry their reason on purpose. A rule with no reason has no expiry
label: nobody can tell whether it still applies, so it either survives past its
stack or gets deleted along with the ones that still matter. See
[Keeping this file honest](#keeping-this-file-honest).

## What this course is

**SLOP1227: Introduction to Naps** --- a 1000-level breadth course arguing that
the nap is a biological need modern work schedules erased. Twelve weeks hold
that one line: what the brain does in twenty minutes of sleep, why the afternoon
dip exists, how industrial timekeeping pushed daytime sleep out of ordinary
life, which cultures kept it, and what it would take to design workplaces,
schools and hospitals that let people sleep when their bodies ask to. The site
enacts its own subject --- a **Nap Mode** toggle dims the page, enlarges body
text, collapses the navigation, and reverts itself after twenty minutes, which
is Week 2's ideal nap length read from a single constant.

The detail --- week cadence, dates, assessments, build sequence --- is in
[`plan.md`](plan.md): a sentence or two here because this file loads into every
session automatically, the rest there because `plan.md` does not. *(A topic and
a whole build plan were once settled only in `plan.md`, which nothing
referenced: an agent starting fresh knew every rule here and not what it was
building.)*

## This deliverable's requirements

Easy to lose track of once you're deep in one week's content, and nothing in
`pnpm check` catches most of them. The spec's lines are **quoted verbatim** from
[the assignment 2
page](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/assessments/assignment-2/)
--- paraphrased at first, which this file can't afford: it is read as process
evidence, and a requirement restated in the author's own words is no longer the
requirement.

- **Niche, not a reskin.** The course has to be narrow enough that no real
  university would run it, but deep enough to fill a semester --- one idea
  explored throughout, not COMP4020 with a find-and-replace. The brief names
  that failure mode explicitly and points at three real course sites ---
  *Calling Bullshit*, *How to Make (Almost) Anything*, *CS 007: Personal
  Finance for Engineers* --- as what "one idea held all the way through" looks
  like. This is worth 35% of the mark (response to the brief) and no check can
  catch a course that's technically complete but topically thin --- only a
  read-through can.
- One niche course **"under a SLOPxxxx code that keeps the three digits your
  repo arrived with"**, **"running across twelve dated teaching weeks"**, with
  **"at least one lecture carries a real deck, linked from its page"** and
  **"assessment that adds up to 100%"**. All four are asserted in
  `spec/course-promises.test.ts` now --- the code's last three digits still
  `227`, weeks 1–12 exactly, a deck with slides on it linked from every
  lecture, and weights summing to 100 --- so a read-through is no longer the
  only thing catching a gap here. *(This said "all four" while listing three:
  the code had no test, and the schema's regex fixes only the code's shape, so
  `SLOP1500` built green. The claim was made true by adding the check rather
  than by softening the sentence --- but it was wrong in this file for two
  weeks, which is the exact failure "a wrong reason is worse than none" names
  below.)*
- **"your own checks in `spec/`, protecting the promises your course makes that
  the build cannot"**. *(So the tests above are required, not optional --- easy
  to miss, because `spec/README.md` frames them as "yours to write".)*
- **"deployed and live at its public GitHub Pages URL by the deadline, working
  at both marking viewports"**, and **"`pnpm check` and `pnpm check:evidence`
  pass"**. Ship (flip the repo public) with a day's margin, not at noon on the
  Monday: CI only runs once public, "still running" counts as not green, and
  nothing in `check` looks at the live URL. *(This used to aim at "before the
  crit" --- a separate, later event, and several days too generous.)*
- **Where effort goes when time runs short**: process is 45% of the mark,
  response to the brief 35%, the working artefact 20%. Polishing visuals
  nobody is scoring that heavily is a worse use of remaining time than making
  sure `PROCESS.md`'s citations are real and the commit trail shows the work.

## How to work in here

- Keep the dev server running (`pnpm dev`) so you see changes as you make them.
- Run `pnpm check` before you push.
- Open the page in a browser and look at it, at **both marking viewports (1920
  and 390)**. The rendered page is the truth; your mental model of it isn't.
- **Use `agent-browser` to see the page, not just to check it built.** It drives
  a real browser, takes screenshots, and reads the accessibility tree and
  console errors --- closing the gap no code-level check reaches, since none of
  them can tell you what the page *looks like*. It's an external CLI
  ([`vercel-labs/agent-browser`](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/topics/backpressure/#agent-browser-the-rendered-page-as-ground-truth)),
  not bundled in this repo, so install it before assuming it's there. *(This tip
  was in the harness at crit 2 and A1, then silently dropped at crit 4 along
  with everything else this file's own "Keeping this file honest" section
  complains about --- restored for A2 after checking the course site still
  documents it as current.)*
- **Don't `cd`.** Put the directory in the command instead --- `pnpm -C <repo>`,
  `git -C <repo>` --- and give scripts absolute paths. The shell's working
  directory persists between tool calls, so one `cd` into `/tmp` to poke at a
  probe silently pollutes every command after it. The asymmetry is what makes
  this dangerous: `pnpm` fails loudly when it lands somewhere without a
  `package.json`; `git` in a *different* repo does not, and neither does a
  relative path that happens to resolve.
- **Before trusting a measurement, know which build it read.** Written from two
  failures in A1, not from caution. Once `pnpm check` never ran (wrong
  directory, above) while `pnpm preview` kept serving the previous `dist/`, so
  the probe reported a fix hadn't worked when it had. Once a CDP probe reused
  one tab across navigations, Chrome left the rules consuming a changed custom
  property unrecomputed, and the probe reported the view was flat when it
  wasn't. Same shape both times, and it is the worst shape a bug can have:
  **a lying instrument is worse than no instrument, because it argues for
  editing code that is already correct.** So a probe must print what it measured
  --- the `mtime` of the `dist/` file it read --- and must open a fresh tab per
  measurement. If a probe says nothing changed, suspect the probe before the
  code.
- **Anything with a fixed height has to be measured, not looked at.** In A1 a
  slab's height was a percentage of a fixed stack, so text put into one either
  fit or silently spilled under the slab below. The phone verdict overflowed by
  three pixels: invisible in a screenshot, obvious the moment something read
  `scrollHeight` against `clientHeight`. So when you add text to a box whose
  height the content doesn't get to set, measure that pair before you say it
  fits --- and measure it at 390 as well as 1920, because the box shrinks and
  the sentence doesn't.
- **One fact, one piece of code.** In A1 the page answered "did this column
  expose that layer?" in two places --- the verdict printed on the slab, and the
  sentence the marker read out. They started as two calculations of the same
  thing, which is a page that can say cyan stalls here while the slab beside it
  says the layer saw nothing. They ended up sharing one function. If a fact
  appears twice on screen, it comes from one function; if a piece of geometry
  appears twice, it comes from one constant. Two sources for one fact is not
  duplication you can clean up later --- it is a page that will eventually
  contradict itself in front of a reader. **This one matters more here than it
  ever has:** a course site states the same dates, weights and week numbers
  across twenty-odd pages, and every one of those is a fact with two possible
  homes. **So, settled for this repo before any content exists: dates, weights
  and week numbers live in `src/course-config.ts` and in each entry's
  frontmatter, and prose never hardcodes them --- pages read them from there.**
  Deciding this up front costs nothing; discovering it after twelve weeks of
  sessions have each typed the same date is twelve files of rework. *(Nothing
  checks this. It expires as a written rule if a `spec/` test can ever assert
  that no rendered prose contains a date literal.)*
- **Default to incremental.** Unless the task says otherwise: don't restructure
  the page, don't rewrite copy that's already there, don't break an interaction
  that already works. Attach the new thing to what exists. For each new feature,
  say back two things before building it --- **when it updates** and **what must
  not change**. In A1 that question alone settled a whole feature's design
  before any code was written.
- **stylelint here is mostly about where a rule sits, not what it says.** Three
  of its rules have cost a build-and-retry more than once: a less specific
  selector may not come after a more specific one matching the same element
  (`no-descending-specificity`); a blank line before a declaration that follows
  another declaration is an error unless a comment sits between them
  (`declaration-empty-line-before`); a comment needs a blank line before it
  (`comment-empty-line-before`). Lint runs **before** the build (`check` is
  `typecheck && lint && test`, and `test` is `build && vitest`), so a misplaced
  CSS rule fails fast --- but because the steps chain with `&&`, it also stops
  the run before the build and the spec, so one comment in the wrong place
  hides every other result you were trying to get. Getting them right while
  writing costs nothing. *(Expires if stylelint leaves `pnpm check`. Dropped at
  crit 4, sat dead for two weeks, reinstalled for A2. The ordering above was
  wrong until checked against `package.json`.)*
- Two CSS facts that fail *silently*, which is why they are written down rather
  than remembered. An `opacity` below 1 forces `transform-style: flat` on that
  element's subtree, so a fade put on a 3-D container flattens the thing it was
  meant to fade --- put it on the leaf. And `calc(a + -0.5 * b)` is a parse most
  of the way to nonsense: emit the sign explicitly. A gradient that fails to
  parse doesn't warn, it just doesn't paint, and an element that never appears
  looks exactly like an element you forgot to write.
- **`astro-theme-university`'s a11y walk can't see OKLCH.** Nap Mode re-lights
  every surface and ink token through `oklch(from var(--at-primary) L c h)`,
  and axe reports that as "incomplete" rather than pass or fail --- so a real
  contrast regression in `nap-mode.css` would build green. The floors there
  are verified by hand (OKLCH → sRGB → WCAG luminance) and recorded in that
  file's header comment; re-measure by hand if the palette moves again, don't
  trust "no accessibility violations" to have looked at it.
- When a check fails, read its output before you change anything. Each check
  names what it measures, and the failure message is the instruction: it tells
  you the file, the line, or the contract. Treat a red check as authoritative
  --- the page is wrong until the check is green, not until you decide it should
  be.
- Never commit a red state.

## Process and integrity

- **Commit as you go.** Small, frequent commits are the record of how the work
  came together, and that record is read, not just the final state --- a trail
  that grew alongside the code is the strongest evidence of process; a single
  dump the night before is the weakest. *(This rule existed at A1, was dropped
  at crit 4 alongside the PROCESS.md rule below, and never came back until now.
  Restored because process is 45% of this deliverable's mark and commit
  granularity is the one part of it a marker can see directly.)*
- **This file is process evidence.** The harness built to direct the agent ---
  this `CLAUDE.md` --- is itself read as part of how the work was done. Keep it
  honest and current.
- **The course is a fiction; nothing inside it is a fabrication.** An invented
  course with invented staff is the assignment. A *photograph* of a person who
  does not exist is not --- it was the one piece of the template that would
  have been a forgery rather than a fiction, so both starter portraits were
  deleted rather than replaced (`b7c6e7a`). The line is whether a reader could
  mistake the artefact for a record of something real: invented names, weeks
  and readings are transparently part of the fiction, while a face, a citation
  or a commit SHA reads as a record and would be a false one. So no invented
  faces, no invented citations, no invented SHAs --- if a piece of the fiction
  needs one of those to work, cut the piece. *(Written down because it was
  decided once, in a commit body, and "a decision recorded only where nothing
  points is not recorded" is this file's own rule. Nothing checks the faces;
  `check:evidence` does check the SHAs.)*
- **Don't draft `PROCESS.md` for the student, even to get a check green.** The
  spec says it **"runs to 400–600 words"** and is **"written by you for a
  reader"** --- the spec's own words settle whose account it is.
  `PROCESS.md` is graded as their own first-person account of what they decided
  and why; if the agent writes the substance, it stops being evidence and
  becomes the exact "false account" risk the course's integrity policy names.
  When it's due, ask specific questions --- which commit was the actual turning
  point and why, which decision they deliberately left out of the harness ---
  and drop their own words in verbatim, or leave a skeleton of headings for them
  to fill in. A rushed, generic account the student wrote is worth more than a
  polished one the agent wrote; don't optimise for the check going green over
  the account being real. *(No expiry. This is about whose account it is, not
  about a tool.)*

## The checks

- `pnpm check` --- `astro check` (types), then `oxlint`, then `stylelint`, then
  `pnpm build` and `vitest run spec`. This is the gate before every push.
- `pnpm check:evidence` --- the extra gate before shipping. Runs fully offline.
  It fails if starter content is still in `src/` (it greps for `STARTER_CONTENT`
  markers), if a starter image still hashes to the shipped placeholder, or if
  `PROCESS.md` cites a commit SHA that doesn't exist in this repo. Assignment
  repos carry no `reflections/` entry --- it checks for none.
- `pnpm test:template` --- the template's own tests, over `scripts/`. Don't edit
  those; they guard the Pages base path and the course config. **It fails here,
  4 of 40, and that is not a thing to fix.** All four are
  `scripts/check-evidence.test.ts:217`, `"rejects the unchanged starter %s"`,
  which copies the four starter images *out of the live working tree* into a
  fixture and asserts `check:evidence` rejects them. Two are present but
  legitimately re-cut (`73d30ea`), so their hashes no longer match the
  placeholder, `check:evidence` correctly exits 0, and the test reports
  `expected +0 to be 1`. The other two are the staff portraits, deleted on
  purpose (`b7c6e7a`, and the fiction/fabrication bullet above), so
  `copyFileSync` raises `ENOENT`. **Doing the assignment correctly is what
  turns this red, and the only way to make it green is to restore the starter
  artwork --- which turns `check:evidence` red.** The two gates cannot both be
  green in a finished repo. CI knows this:
  `.github/workflows/checks.yml:41` runs this job only `if: ${{
  github.event.repository.is_template }}` ("These tests protect starter
  internals, not decisions students make"), and line 46 gates `check:evidence`
  on the negation. A student repo is not a template, so CI skips the job and
  this local red cannot turn the ship red. *(Written down because a red gate
  with no explanation invites a "fix", and here the available fix is a
  regression that would undo `73d30ea` and `b7c6e7a`. Found by running it: the
  A2 audit listed this gate and never ran it, so four reds sat unexplained for
  a week. Expires if the template guards that `copyFileSync` with an
  `existsSync`, which would take the two ENOENT cases out.)*
- CI runs the same, plus two secret scans (both trufflehog --- one for live
  secrets, one matching the course key's shape via `.github/trufflehog.yml`),
  the deploy, and a job that verifies the deployed site is online.
- `.githooks/pre-commit` blocks a commit if anything staged matches
  `sk-[A-Za-z0-9_-]{20,}` **and** has an uppercase character (the second stage
  spares lowercase slugs). A refused commit is the hook, not git.
- `spec/*.test.ts` runs with `pnpm check`. `spec/invariants.test.ts` holds what
  is true of any good site; `spec/data-integrity.test.ts` ships with the
  template; the week's own contract goes in a file alongside them.
- **online** --- a green `deploy` job is not proof the site serves. After
  shipping, open the deployed Pages URL yourself and load a real page: an asset
  that 404s there is broken even though it loaded locally. Nothing in `check`
  looks at the live URL.
- `pnpm check` chains with `&&`, so the first red step stops the rest, and the
  order is types, lint, build, spec. A type or lint error therefore means **the
  build and the spec never ran** --- "the spec passes" is not something you have
  learnt yet. *(This said the opposite until checked against `package.json`.)*
  While the repo is private CI is skipped entirely, so this local run is the
  only loop there is; once public, CI needs time to finish, and still-running
  counts as not green.
- Accessibility is already measured. `astro-theme-university` walks every built
  page during `pnpm build` and logs how many it checked and whether any
  violated. Don't wire a second a11y sensor --- read that one. *(Exception:
  OKLCH-based color, which it can't parse --- see the Nap Mode bullet
  above.)*
- **Performance is measured by nothing here.** If the spec wants evidence you
  tested it, that is your work. And read a green number honestly: it is one run
  on a CI machine, not proof the site is fast for real users.

## Keeping this file honest

Every rule above states the failure it came from. That's not decoration --- it
is the only thing that makes a rule reviewable later. When a rule's stack goes
away, its reason tells you so and you can delete it on purpose. When a rule has
no reason, nobody can tell a dead rule from a live one, and the file loses the
live ones along with the dead. That has already happened once in this course:
the rule against the agent drafting the student's own account was dropped
between A1 and crit 4 with nothing to say why it existed.

Two more failure modes, both found by auditing this file rather than by being
bitten:

- **A wrong reason is worse than none** --- it just gets believed. Two bullets
  here had lint running after the build. Three factual claims in this file were
  wrong when first written, and none were caught by a check going red. So check
  any claim about a tool against `package.json`, the workflow, or the script.
- **A decision recorded only where nothing points is not recorded.** This file
  is the only one guaranteed to be read; anything a future session must not
  rediscover belongs here, at least as a pointer.

So: when you add a rule, write the failure that caused it, and check any factual
claim in it against the repo. When you delete one, say what stopped being true.
When you settle something outside this file, leave a pointer inside it.
