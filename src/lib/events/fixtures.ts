// Dev-only fixtures for the e2e suite (tests/events.spec.ts).
//
// /events is server-rendered from live Supabase rows and the wall clock, so a
// test that reads "whatever is upcoming" passes or fails with the calendar.
// (2026-09-30: no partner events were left in September, the calendar opened on
// an empty month, and three tests failed and blocked the deploy.) A request
// carrying `x-events-fixture: <name>` gets a fixed clock and fixed rows instead.
//
// Honoured only under `astro dev`: `import.meta.env.DEV` is a build-time
// constant, so in the production bundle `eventsFixture` always returns null and
// the header is ignored.
import type { EventRow } from "./types";

const FIXTURE_HEADER = "x-events-fixture";

/**
 * True for a dev request that asks for a fixture. The edge cache in
 * src/middleware.ts keys on the URL alone, so it must step aside for these or
 * one clock's HTML is served to the next.
 */
export function isEventsFixtureRequest(request: Request): boolean {
  return import.meta.env.DEV && request.headers.has(FIXTURE_HEADER);
}

export interface EventsFixture {
  /** The frozen "now" every date decision on the page uses. */
  now: Date;
  /** Same contract as the `getUpcomingEvents` select. */
  upcoming(): EventRow[];
  /** Same contract as the `getEventById` select. */
  byId(id: number): EventRow | undefined;
  /** Same contract as the `getMoreFromPartner` select. */
  moreFromPartner(partnerSlug: string, excludeId: number): EventRow[];
}

type Seed = Pick<EventRow, "id" | "title" | "event_datetime" | "event_end_datetime"> & Partial<EventRow>;

const row = (seed: Seed): EventRow => ({
  description: "Free for newcomers. Drop in, no registration needed.\n\nBring a friend.",
  location: "Central Library",
  address: "350 W Georgia St, Vancouver",
  event_type: "in-person",
  genre: "Language",
  hosted_by: null,
  cover_photo_url: null,
  external_link: "https://example.com/register",
  source: "fixture",
  is_featured: false,
  partner_slug: null,
  ...seed,
});

// Pacific wall-clock times with explicit offsets (PDT until 2026-11-01, then
// PST). Event days: Oct 7, 8, 14, 15, 29 and Nov 3, 12. Nothing in September.
// A function, not a module-level array, so the production build drops it.
const fixtureRows = (): EventRow[] => [
  row({
    id: 9001,
    title: "ESL Conversation Practice",
    cover_photo_url: "/assets/images/community/newcomer-community-vancouver-800.jpg",
    event_datetime: "2026-10-07T10:00:00-07:00",
    event_end_datetime: "2026-10-07T11:00:00-07:00",
    partner_slug: "vancouver-public-library",
  }),
  row({
    id: 9002,
    title: "Tech Help",
    event_datetime: "2026-10-07T13:00:00-07:00",
    event_end_datetime: "2026-10-07T14:00:00-07:00",
    genre: "Education",
    partner_slug: "vancouver-public-library",
  }),
  row({
    id: 9003,
    title: "Resume Workshop for Newcomers",
    event_datetime: "2026-10-08T17:00:00-07:00",
    event_end_datetime: "2026-10-08T19:00:00-07:00",
    genre: "Employment",
    location: "Burnaby Neighbourhood House",
    address: "4460 Beresford St, Burnaby",
    partner_slug: "burnaby-neighbourhood-house",
  }),
  row({
    id: 9004,
    title: "Settlement Services for Newcomers",
    event_datetime: "2026-10-14T09:00:00-07:00",
    event_end_datetime: "2026-10-14T12:00:00-07:00",
    genre: "Documentation",
    location: "City Centre Library",
    address: "10350 University Dr, Surrey",
    partner_slug: "surrey-libraries",
  }),
  row({
    id: 9005,
    title: "International Student Group Advising",
    event_datetime: "2026-10-15T14:00:00-07:00",
    event_end_datetime: null,
    event_type: "online",
    genre: "Education",
    hosted_by: "International Services for Students",
    partner_slug: "sfu",
  }),
  row({
    id: 9100,
    title: "Unify Gather: Newcomer Social",
    cover_photo_url: "/assets/images/community/newcomer-community-vancouver-800.jpg",
    event_datetime: "2026-10-17T18:00:00-07:00",
    event_end_datetime: "2026-10-17T21:00:00-07:00",
    genre: "Socials",
    hosted_by: "Unify Social",
    location: "Trout Lake Community Centre",
    address: "3360 Victoria Dr, Vancouver",
    is_featured: true,
  }),
  row({
    id: 9006,
    title: "Newcomer Tax Basics",
    event_datetime: "2026-10-29T18:00:00-07:00",
    event_end_datetime: "2026-10-29T19:30:00-07:00",
    genre: "Finance",
    location: "Burnaby Neighbourhood House",
    address: "4460 Beresford St, Burnaby",
    partner_slug: "burnaby-neighbourhood-house",
  }),
  row({
    id: 9007,
    title: "Practice Speaking English",
    event_datetime: "2026-11-03T13:00:00-08:00",
    event_end_datetime: "2026-11-03T14:00:00-08:00",
    location: "City Centre Library",
    address: "10350 University Dr, Surrey",
    partner_slug: "surrey-libraries",
  }),
  row({
    id: 9008,
    title: "Career Fair Prep",
    event_datetime: "2026-11-12T12:00:00-08:00",
    event_end_datetime: "2026-11-12T13:00:00-08:00",
    genre: "Employment",
    location: "Capilano University",
    address: "2055 Purcell Way, North Vancouver",
    partner_slug: "capilano-university",
  }),
  // Already over on both clocks: never listed, still reachable by id.
  row({
    id: 9050,
    title: "Library Tour for Newcomers",
    event_datetime: "2026-09-20T10:00:00-07:00",
    event_end_datetime: "2026-09-20T11:00:00-07:00",
    genre: "Education",
    partner_slug: "vancouver-public-library",
  }),
];

// `extra` is a function for the same reason as `fixtureRows`: nothing here may
// run at module load, or the production build keeps it.
const CLOCKS: Record<string, { now: string; extra?: () => EventRow[] }> = {
  // A Tuesday with events left in the current month.
  "mid-month": { now: "2026-10-06T12:00:00-07:00" },
  // The failed deploy run (Actions 36791295477): last day of September, every
  // upcoming event in a later month.
  "month-end": { now: "2026-09-30T16:28:50-07:00" },
  // Just past midnight on Nov 1 with one event still running from Oct 31: the
  // first listed event starts in the month before the current one.
  ongoing: {
    now: "2026-11-01T00:15:00-07:00",
    extra: () => [
      row({
        id: 9060,
        title: "Halloween Community Night",
        event_datetime: "2026-10-31T21:00:00-07:00",
        event_end_datetime: "2026-11-01T00:45:00-07:00",
        genre: "Socials",
        partner_slug: "burnaby-neighbourhood-house",
      }),
    ],
  },
};

const WINDOW_MONTHS = 4;
const byStart = (a: EventRow, b: EventRow) =>
  Date.parse(a.event_datetime) - Date.parse(b.event_datetime) || a.id - b.id;

export function eventsFixture(request: Request): EventsFixture | null {
  if (!import.meta.env.DEV) return null;
  const clock = CLOCKS[request.headers.get(FIXTURE_HEADER) ?? ""];
  if (!clock) return null;

  const ROWS = [...fixtureRows(), ...(clock.extra?.() ?? [])];
  const now = new Date(clock.now);
  const until = new Date(now);
  until.setMonth(until.getMonth() + WINDOW_MONTHS);
  const startsAfterNow = (r: EventRow) => Date.parse(r.event_datetime) >= now.getTime();

  return {
    now,
    upcoming: () =>
      ROWS.filter(
        (r) =>
          (r.event_end_datetime ? Date.parse(r.event_end_datetime) >= now.getTime() : startsAfterNow(r)) &&
          Date.parse(r.event_datetime) <= until.getTime() &&
          (r.is_featured || r.partner_slug !== null),
      ).sort(byStart),
    byId: (id) => ROWS.find((r) => r.id === id),
    moreFromPartner: (partnerSlug, excludeId) =>
      ROWS.filter((r) => r.partner_slug === partnerSlug && r.id !== excludeId && startsAfterNow(r))
        .sort(byStart)
        .slice(0, 3),
  };
}
