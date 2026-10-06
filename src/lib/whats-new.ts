// "What's new in Unify": the changelog at /whats-new.
//
// To add an update, copy an entry and edit it. The page sorts by date, newest
// first, so position in this list only matters between entries that share a
// date (earlier in the list shows first).
//
//   date         YYYY-MM-DD, the day it went live
//   title        one short line, no full stop
//   description  one plain sentence
//   link         optional. Web app links start with https://app.unifysocial.ca
//
// Only list what is live. Keep the copy plain: no jargon, no em dashes.

export interface WhatsNewEntry {
  date: string;
  title: string;
  description: string;
  link?: { label: string; href: string };
}

export const WHATS_NEW: WhatsNewEntry[] = [
  {
    date: "2026-10-06",
    title: "Group names in every language",
    description: "Group names and descriptions now show in the language you use.",
  },
  {
    date: "2026-10-06",
    title: "Unify in 7 languages, with lighter downloads",
    description:
      "Use Unify in English, French, Spanish, Arabic, Hindi, Punjabi or Vietnamese, and the app now downloads only the language you pick.",
    link: { label: "Open Unify in your browser", href: "https://app.unifysocial.ca" },
  },
  {
    date: "2026-10-06",
    title: "Faster loading across the app",
    description: "Pages and tabs open with their content straight away, and pictures show up sooner.",
  },
  {
    date: "2026-10-05",
    title: "Smoother animations",
    description: "Menus, pop-ups and buttons now move the same calm way everywhere in the app.",
  },
  {
    date: "2026-10-02",
    title: "Search in Social",
    description: "Find posts, people and groups from the Social page.",
    link: { label: "Try Social search", href: "https://app.unifysocial.ca/home" },
  },
  {
    date: "2026-10-02",
    title: "A quick tour of what's new",
    description: "When something changes, a short tour in the app points to where it is.",
  },
  {
    date: "2026-09-28",
    title: "Resume and cover letter export in your language",
    description: "Downloads now match the language your resume or cover letter is written in.",
    link: { label: "Open the resume builder", href: "https://app.unifysocial.ca/resume" },
  },
];

/** True for a real calendar day written YYYY-MM-DD ("2026-13-01" and "2026-02-30" are not). */
function isCalendarDay(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const parsed = new Date(`${date}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
}

/**
 * Newest first; entries on the same date keep their order in the list. Throws
 * on a mistyped date so the build fails with the entry named, instead of the
 * page showing "Invalid Date".
 */
export function whatsNewNewestFirst(entries: WhatsNewEntry[] = WHATS_NEW): WhatsNewEntry[] {
  for (const entry of entries) {
    if (!isCalendarDay(entry.date)) {
      throw new Error(`whats-new: "${entry.title}" has date "${entry.date}"; use a real day as YYYY-MM-DD.`);
    }
  }
  return entries
    .map((entry, i) => ({ entry, i }))
    .sort((a, b) => b.entry.date.localeCompare(a.entry.date) || a.i - b.i)
    .map(({ entry }) => entry);
}
