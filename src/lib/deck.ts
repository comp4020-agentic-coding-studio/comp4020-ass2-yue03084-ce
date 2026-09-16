import { getPublishedCollection } from "astro-course-university/content";

/**
 * The lecture that carries the built deck.
 *
 * Which week the deck sits on is stated once, in the `slides` field of that
 * lecture's own frontmatter, and read from here by the two pages that mention
 * it in prose. Typed a second time it becomes a sentence that goes quietly
 * wrong the moment the deck moves — and it would go wrong on the lectures
 * index, which is the page a reader checks *because* they are looking for the
 * slides.
 *
 * `spec/course-promises.test.ts` already asserts that a lecture claims a deck
 * and that the deck was actually built; this is the same fact reaching the
 * prose, so the sentence and the test cannot disagree.
 *
 * Sorted by week and first taken, so that a second deck later in the semester
 * makes this name the earliest one rather than an arbitrary one. Returns
 * `undefined` if no lecture carries slides — callers render nothing rather
 * than a sentence with a hole in it.
 */
export async function deckLecture() {
  const lectures = await getPublishedCollection("lectures");
  return lectures
    .filter((lecture) => typeof lecture.data.slides === "string")
    .sort((a, b) => a.data.week - b.data.week)[0];
}
