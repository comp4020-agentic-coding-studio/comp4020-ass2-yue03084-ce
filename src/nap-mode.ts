import { courseMeta, NAP_MINUTES } from "./course-config";

/**
 * Where a nap's *expiry* lives. A timestamp, not a boolean: this is a
 * multi-page site, so a nap has to survive navigation and keep running down
 * while it does. A boolean would restart the twenty minutes on every click of
 * a link, which is the one thing a nap timer must not do.
 */
export const NAP_STORAGE_KEY = `${courseMeta.code.toLowerCase()}:nap-until`;

/** The nap, in milliseconds. Derived — the twenty is `NAP_MINUTES`. */
export const NAP_MS = NAP_MINUTES * 60_000;
