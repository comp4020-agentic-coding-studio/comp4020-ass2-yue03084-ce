import { getPublishedCollection } from "astro-course-university/content";

/**
 * The sentence the homepage and the lectures index use to say where the slides
 * are.
 *
 * The *sentence* lives here, not just the data behind it, because both pages
 * print it and a sentence assembled twice is a page that can eventually
 * contradict itself. It used to name a single week --- true while week 2 was
 * the only deck, and quietly wrong the moment a second lecture carried one,
 * because "Week 1 comes with slides" reads as *only* week 1 does.
 *
 * Derived from the `slides` frontmatter field rather than from a count kept
 * anywhere, so a deck added or removed moves this sentence with it.
 * `spec/course-promises.test.ts` separately asserts that every `slides` path
 * was actually built, so the sentence cannot promise a deck that does not
 * exist.
 *
 * Returns `undefined` when no lecture carries slides --- callers render
 * nothing rather than a sentence with a hole in it.
 */
export async function deckNote() {
  const lectures = await getPublishedCollection("lectures");
  const weeks = lectures
    .filter((lecture) => typeof lecture.data.slides === "string")
    .map((lecture) => lecture.data.week)
    .sort((a, b) => a - b);
  if (weeks.length === 0) return undefined;
  if (weeks.length === lectures.length) return "Every one comes with a deck.";
  return `Weeks ${weeks.join(", ")} come with a deck.`;
}
