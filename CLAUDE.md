# COMP4020 Assignment 2 harness

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

The course this repo builds is **the laugh track** --- canned laughter, and the
studio audience as a manufactured object. The twelve-week arc, the assessment
split, the typographic language (`[LAUGHTER]` and the rest of the
closed-caption convention for laughter), and the build sequence are in
[`plan.md`](plan.md). Read it before building content; it names real files and
real schema fields.

- **Dates, weights and week numbers live in `src/course-config.ts` and in each
  entry's frontmatter --- never written into prose.** Pages read them from
  there. This is "One fact, one piece of code" below, decided for this repo
  *before* any content exists, because the alternative is discovering it after
  twelve weeks of sessions have each hardcoded the same date. *(Expires when a
  `spec/` test can assert no rendered prose contains a date literal. Nothing
  does yet.)*

*(This section exists because of a failure in this session, not a hypothetical.
The topic, the design language and the entire plan were settled in conversation
and written to `plan.md` --- and `plan.md` is loaded into no session and was
referenced by nothing. An agent starting fresh would read this file, learn every
rule in it, and still have no idea what course it was building. A decision
recorded only in a file nobody is told to open is not a decision the next
session has.)*

## This deliverable's requirements

These come straight from the A2 brief and spec, not from a failure in this
repo yet --- they're here because they're easy to lose track of once you're
deep in writing content for one week and forget the shape the whole site has
to hit, and nothing in `pnpm check` catches most of them today.

- **Niche, not a reskin.** The course has to be narrow enough that no real
  university would run it, but deep enough to fill a semester --- one idea
  explored throughout, not COMP4020 with a find-and-replace. The brief names
  that failure mode explicitly and points at three real course sites ---
  *Calling Bullshit*, *How to Make (Almost) Anything*, *CS 007: Personal
  Finance for Engineers* --- as what "one idea held all the way through" looks
  like. This is worth 35% of the mark (response to the brief) and no check can
  catch a course that's technically complete but topically thin --- only a
  read-through can.
- **Twelve dated teaching weeks**, all under this course's code. *(Spec
  requirement. Expires as a manual reminder once a `spec/*.test.ts` counts
  them --- worth writing that test once the content is closer to real than
  the two placeholder weeks currently here.)*
- **At least one lecture with a real deck**, linked from its page, not a
  placeholder. *(Spec requirement, same expiry condition as above.)*
- **Assessment weightings sum to 100%.** *(Spec requirement and mechanically
  checkable --- write the test once the assessments are real content instead
  of trusting the arithmetic by eye each time one changes.)*
- **Ship (flip the repo public) with a day or so of margin before the crit,
  not at the deadline.** CI only runs once the repo is public, "still
  running" counts as not green (see "online" below), and the retro crit reads
  from `PROCESS.md` against whatever's actually deployed --- there's no
  benefit to holding the ship until the last hour and real risk in CI not
  finishing in time.
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
  homes.
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
  (`comment-empty-line-before`). None of these show up until `pnpm check`
  reaches lint, which is after the build, so getting them right while writing
  costs nothing and getting them wrong costs a whole round. *(Expires if
  stylelint leaves `pnpm check`. It was dropped at crit 4 and this rule sat dead
  in the file for two weeks --- deliberately reinstalled for A2, so the rule is
  live again.)*
- Two CSS facts that fail *silently*, which is why they are written down rather
  than remembered. An `opacity` below 1 forces `transform-style: flat` on that
  element's subtree, so a fade put on a 3-D container flattens the thing it was
  meant to fade --- put it on the leaf. And `calc(a + -0.5 * b)` is a parse most
  of the way to nonsense: emit the sign explicitly. A gradient that fails to
  parse doesn't warn, it just doesn't paint, and an element that never appears
  looks exactly like an element you forgot to write.
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
- **Don't draft `PROCESS.md` for the student, even to get a check green.**
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
  those; they guard the Pages base path and the course config.
- CI runs the same, plus two secret scans and the deploy.
- `spec/*.test.ts` runs with `pnpm check`. `spec/invariants.test.ts` holds what
  is true of any good site; `spec/data-integrity.test.ts` ships with the
  template; the week's own contract goes in a file alongside them.
- **online** --- a green `deploy` job is not proof the site serves. After
  shipping, open the deployed Pages URL yourself and load a real page: an asset
  that 404s there is broken even though it loaded locally. Nothing in `check`
  looks at the live URL.
- `pnpm check` chains its steps with `&&`, so the first red one stops the rest.
  A broken build means lint and the spec never ran --- "lint passed" is then
  something you have not actually learnt yet. While the repo is private CI is
  skipped entirely, so this local run is the only loop there is; once it is
  public, CI needs time to finish, and still-running counts as not green.
- Accessibility is already measured. `astro-theme-university` walks every built
  page during `pnpm build` and logs how many it checked and whether any
  violated. Don't wire a second a11y sensor --- read that one.
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

So: when you add a rule, write the failure that caused it. When you delete one,
say what stopped being true.
