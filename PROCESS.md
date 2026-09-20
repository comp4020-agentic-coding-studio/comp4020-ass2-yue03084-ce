# Process overview

## What I built

SLOP1227 *Introduction to Naps*: a twelve-week course arguing that the nap is a
biological need modern work schedules erased. It was not my first idea. I had
planned a course on canned laughter and written the whole twelve-week structure
for it before dropping it ([`342bae3`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-yue03084-ce/commit/342bae3)),
because the more I looked at it the further it ran past what I actually knew —
I could not have designed or defended a semester of it. Naps were easier to get
hold of, and inside what I already understood.

I wanted the site to do the thing it describes rather than only describe it, so
the course has a Nap Mode: the page dims, body text grows, the navigation
collapses, and it puts itself back after twenty minutes — Week 2's ideal nap
length, read from one constant rather than typed anywhere
([`d74a9f0`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-yue03084-ce/commit/d74a9f0)).

I decided a good course is complete, closed, and interesting. Complete I partly
inherited from the brief, and I turned it into checks: exactly weeks 1–12, a
deck that really exists at the end of its path, weights summing to 100
([`a3094bd`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-yue03084-ce/commit/a3094bd),
[`7e7b70a`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-yue03084-ce/commit/7e7b70a)).
Closed was mine and the brief never asked for it: weeks 7, 8, 9 and 12 each
produce one component of the final policy proposal — the workplace map, the
costing, the named beneficiary, and the objections it has to survive — so the
40% assessment is assembled across the semester instead of set at the end
([`91859ec`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-yue03084-ce/commit/91859ec)).

## How I got here

The turning point was
[`505f0db`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-yue03084-ce/commit/505f0db).
Driving the built page in a browser found three real Nap Mode bugs and two
contrast failures, and not one of them could ever have turned `pnpm check` red.
After that commit every Nap Mode change carries a measured number instead of an
assertion.

The clearest place I overruled the agent was
[`d98e299`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-yue03084-ce/commit/d98e299).
I noticed the answers in a long session getting worse, so I started a fresh one
and had the harness audited against `package.json` and the workflow rather than
against what it already said. Three claims in it were wrong: two bullets had
lint running after the build when it runs before, and the ship deadline pointed
at the crit instead of noon on 21 September, a date the file never stated at
all. What I overruled was the assumption that something already written down
was already true.

One decision I kept out of `CLAUDE.md` on purpose: the spec tests assert
`dist/api/index.json`, not frontmatter, so they check what the course
*publishes* rather than what a page happens to be built from. The same commit
reads the course code back from the API instead of the literal in the test file,
because the code being right and the code being on the page are two promises,
not one fact written twice. I left it out because it only comes up when I am
writing a spec test, which happened a handful of times all semester, and
`CLAUDE.md` is loaded into every session — a rule that fires twice does not earn
that space.

How I knew the checks were worth anything: I broke the build first. I mutated
the built API to `SLOP1500` and watched three tests go red before I trusted them
([`d37ed26`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-yue03084-ce/commit/d37ed26)),
and did the same to the earlier three by removing a session, repointing a deck
and shaving a weight. A test that has never failed is not yet evidence.
