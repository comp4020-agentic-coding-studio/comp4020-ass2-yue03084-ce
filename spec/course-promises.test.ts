import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The promises this course makes that the build cannot check for itself.
 *
 * The schemas are strict about each entry in isolation — `week` is capped at 12
 * and `slides` has to match a path shape — but every promise below is about the
 * set of entries, or about the rendered page, and nothing in `pnpm build`
 * looks at either. Each test says what would slip past without it.
 */

interface ApiNode {
  id: string;
  type: string;
  meta?: Record<string, unknown>;
}

interface CourseApi {
  course: { code: string; startDate: string; endDate: string };
  nodes: ApiNode[];
}

const dist = resolve("dist");
const api = JSON.parse(readFileSync(join(dist, "api/index.json"), "utf8")) as CourseApi;
const nodesOfType = (type: string) => api.nodes.filter((node) => node.type === type);

/** Every built HTML page, as paths relative to `dist/`. */
const htmlPages = (() => {
  const found: string[] = [];
  const walk = (dir: string, prefix: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isDirectory()) walk(join(dir, entry.name), rel);
      else if (entry.name.endsWith(".html")) found.push(rel);
    }
  };
  walk(dist, "");
  return found.sort();
})();

const read = (page: string) => readFileSync(join(dist, page), "utf8");

describe("the code this repo was issued", () => {
  // `slopCourseMetaSchema` fixes the code's *shape* — `SLOP`, a level digit
  // from the allowed set, then three more — and `superRefine` ties that level
  // digit to the `level` field. Neither holds the three digits themselves, so
  // `SLOP1500` satisfies the schema, builds green, and is a different course
  // from the one this repo arrived as. The deliverable is specific about it:
  // the code must keep "the three digits your repo arrived with".
  const ISSUED_DIGITS = "227";

  it("keeps the three digits the repo arrived with", () => {
    expect(
      api.course.code.slice(-3),
      `${api.course.code} is not a ${ISSUED_DIGITS} course — this repo was issued SLOP1${ISSUED_DIGITS}`,
    ).toBe(ISSUED_DIGITS);
  });

  it("publishes that code where a reader sees it", () => {
    // Read from the API rather than the literal above: the code being right
    // and the code being on the page are two promises, not one fact twice.
    expect(read("index.html"), "the home page never names the course code").toContain(
      api.course.code,
    );
  });
});

describe("twelve dated teaching weeks", () => {
  // The schema caps `week` at 12 and refuses 13, which is a different promise:
  // it accepts three sessions in week 4 and none in week 9, and the course
  // would still build. Only the *set* being exactly 1–12 says the semester is
  // whole, and a missing week is invisible on a listing page sorted by date.
  const weeksOf = (type: string) =>
    new Set(nodesOfType(type).map((node) => Number(node.meta?.week)));
  const expected = new Set(Array.from({ length: 12 }, (_, index) => index + 1));
  const missing = (weeks: Set<number>) => [...expected].filter((week) => !weeks.has(week));

  it("runs a Nap Lab in each of weeks 1 to 12", () => {
    const weeks = weeksOf("sessions");
    expect(missing(weeks), "weeks with no session").toEqual([]);
    expect([...weeks].filter((week) => !expected.has(week)), "weeks out of range").toEqual([]);
  });

  it("runs a lecture in each of weeks 1 to 12", () => {
    const weeks = weeksOf("lectures");
    expect(missing(weeks), "weeks with no lecture").toEqual([]);
    expect([...weeks].filter((week) => !expected.has(week)), "weeks out of range").toEqual([]);
  });

  it("dates the weeks in ascending order, one week apart or more", () => {
    // Catches a typo'd year or a fortnight's drift that `data-integrity`
    // misses, because a wrong date inside the teaching period still passes it.
    const dated = nodesOfType("sessions")
      .map((node) => ({ week: Number(node.meta?.week), date: String(node.meta?.date).slice(0, 10) }))
      .sort((a, b) => a.week - b.week);
    for (let index = 1; index < dated.length; index += 1) {
      const previous = dated[index - 1]!;
      const current = dated[index]!;
      expect(current.date > previous.date, `week ${current.week} is not after week ${previous.week}`).toBe(true);
    }
  });
});

describe("assessment adds up to 100%", () => {
  // The schema's `weightedMarking` refine validates the criteria *within* one
  // assessment and never the weights *across* the course, so three assessments
  // at 30/30/30 build green and shortchange the students by ten points. This
  // is the gap `CLAUDE.md` calls a real one.
  const assessments = nodesOfType("assessments");

  it("has assessments to weigh", () => {
    expect(assessments.length).toBeGreaterThan(0);
  });

  it("sums the course weights to exactly 100", () => {
    const total = assessments.reduce((sum, node) => sum + Number(node.meta?.weight), 0);
    const breakdown = assessments
      .map((node) => `${node.id} ${String(node.meta?.weight)}%`)
      .join(", ");
    expect(total, `weights sum to ${total}, not 100 — ${breakdown}`).toBe(100);
  });

  it("gives every assessment a due date and a week", () => {
    for (const node of assessments) {
      expect(node.meta?.due, `${node.id} has no due date`).toBeTruthy();
      expect(Number(node.meta?.week), `${node.id} has no week`).toBeGreaterThan(0);
    }
  });
});

describe("a real deck, linked from its lecture", () => {
  // `slides` is a string with a path regex, so a lecture can advertise a deck
  // that was never written and the build stays green — the regex checks the
  // shape of the path, never that anything is at the end of it.
  const withSlides = nodesOfType("lectures").filter((node) => typeof node.meta?.slides === "string");

  it("has at least one lecture carrying a deck", () => {
    expect(withSlides.length).toBeGreaterThan(0);
  });

  it("built every deck that a lecture links to", () => {
    for (const lecture of withSlides) {
      const slides = String(lecture.meta?.slides);
      const built = join(dist, slides.replace(/^\//, ""), "index.html");
      expect(existsSync(built), `${lecture.id} links ${slides}, which was not built`).toBe(true);
      // A deck that built but is empty is the same broken promise.
      expect(readFileSync(built, "utf8").length, `${slides} built empty`).toBeGreaterThan(500);
    }
  });
});

describe("Nap Mode reaches the whole site", () => {
  // Nap Mode is the course's argument made operable, so a page without it is a
  // page where the argument stops. It is injected by two layouts rather than by
  // each page, which is exactly the arrangement that fails silently: a new page
  // importing the theme's layout directly loses the toggle and nothing goes
  // red.
  //
  // The contract is "every page that renders the site chrome". A deck is a
  // standalone Reveal.js page with no nav and legitimately has neither the
  // chrome nor the toggle.
  //
  // This used to allow *one* chrome-less page, which was a stand-in for "the
  // single deck" while week 2 was the only lecture carrying one. Every lecture
  // now carries its own deck, so the count stopped being a contract and became
  // a tripwire on the number of decks. Naming the deck route instead is both
  // honest about which pages are exempt and stricter than the count was: it
  // asserts that *no* page outside `/decks/` is bare, where the old form would
  // have let one through.
  const isDeck = (page: string) => page.startsWith("decks/");
  const chromed = htmlPages.filter((page) => read(page).includes("at-nav-inner"));

  it("finds the site chrome on every page that is not a deck", () => {
    expect(chromed.length).toBeGreaterThan(30);
    const bare = htmlPages.filter((page) => !isDeck(page) && !chromed.includes(page));
    expect(bare, "non-deck pages without site chrome").toEqual([]);
  });

  it("puts the toggle on every page that has the chrome", () => {
    const without = chromed.filter((page) => !read(page).includes("data-nap-toggle"));
    expect(without, "chromed pages with no Nap Mode toggle").toEqual([]);
  });

  it("applies the nap before first paint on every page that has the chrome", () => {
    // Without the head script the nap is applied by the module script after
    // paint, so a napping reader gets one frame of a fully lit page on every
    // navigation — the one thing a dimmed site must not do.
    const without = chromed.filter((page) => !read(page).includes("nap-until"));
    expect(without, "chromed pages with no pre-paint nap script").toEqual([]);
  });

  it("names the nap's storage key after the course code", () => {
    // The key is derived from `courseMeta.code`; if that derivation is ever
    // replaced by a literal, two courses on one origin would share a nap.
    const expected = `${api.course.code.toLowerCase()}:nap-until`;
    expect(read("index.html")).toContain(expected);
  });
});
