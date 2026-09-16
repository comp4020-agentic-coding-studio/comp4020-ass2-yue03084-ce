# Process overview

<!-- TEMPLATE: this sentinel is left here ON PURPOSE, by the agent, and Celeste
     deletes it when the sections below are written.

     `pnpm check:evidence` greps for the string `TEMPLATE:` and fails while it is
     present, so this file keeps the pre-ship gate red until the account exists.
     That is the intended state, not an oversight. The alternative — an empty
     skeleton with the sentinel stripped — makes the gate green over a file with
     no account in it, and a green gate that means nothing is worse than a red
     one that means what it says.

     The headings, the questions under them, and the citation format are the
     agent's. Every word of the account itself is yours: this file is graded as
     your own first-person record of what you decided and why, and 45% of the
     deliverable's mark is process. An account you wrote in a rush is worth more
     here than a polished one you didn't.

     Length: 400-600 words, per the spec. The two H2s below are the shape the
     template shipped; add or split headings if the story wants them. -->

## What I built

<!-- One paragraph: the thing, and the idea behind it.

     You already have the sentence this whole site was built around — it is in
     `src/course-config.ts` as the course description, and the home page
     distributes it across its headings. This paragraph is not that sentence
     again: it is why you chose a course about naps, and what you were trying to
     make the site do that a generic course site would not. -->

## How I got here

<!-- The account of the process: how the work actually went, and how you knew
     the result was right. Any order that makes it clear.

     Four questions worth answering somewhere in here. They are the parts a
     marker cannot reconstruct from the repo, which is exactly why they are
     worth your words:

     1. WHICH COMMIT WAS THE ACTUAL TURNING POINT, AND WHY?
        Not the biggest diff — the one after which the work went differently.
        Cite it. If the turning point was a conversation rather than a commit,
        say that and cite the commit it produced.

     2. WHICH DECISION DID YOU DELIBERATELY LEAVE OUT OF THE HARNESS?
        `CLAUDE.md` is read as process evidence, and it is a record of what you
        chose to make the agent obey. Something you decided and did NOT write
        down there is the more interesting half: what was it, and why did it not
        belong in a file that loads into every session?

     3. WHERE DID YOU OVERRULE THE AGENT, AND WAS THAT RIGHT?
        There is at least one such point in this repo's history. A process
        account that reports only the agent being useful is not an account of a
        process.

     4. HOW DID YOU KNOW? For one specific claim about the finished site, say
        what you actually checked, not that you checked. `pnpm check` passing is
        not evidence you looked at the page.

     CITATIONS. Markers follow these rather than trawling the repo, so cite as
     you go. The link text is the hash, the target is this repo:

       one commit: [`<sha>`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-yue03084-ce/commit/<sha>)
       a range:    [`<from>...<to>`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-yue03084-ce/compare/<from>...<to>)

     `pnpm check:evidence` resolves every SHA you cite against this repo, so a
     typo'd or invented hash fails the gate rather than reaching a marker. To
     see the trail and pick from it:

       git log --oneline --reverse

     To pair a prompt with the commit it produced, quote the prompt — curated,
     not a transcript — next to the citation, as a blockquote.

     Screenshots are welcome where one carries the point better than a sentence.
     Commit the image and link it with a RELATIVE path, which is what makes it
     render on GitHub: `![alt](docs/before.png)`. Images don't count towards the
     word count and don't replace the citation. -->
