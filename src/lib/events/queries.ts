// Every read of public.events lives here (the same rule as GROQ in
// src/lib/sanity/queries.ts): pages and components never build PostgREST
// queries themselves.
import { restSelect } from "./client";
import { toEventView } from "./format";
import type { EventRow, EventView } from "./types";

const COLUMNS = [
  "id", "title", "description", "event_datetime", "event_end_datetime", "location",
  "address", "event_type", "genre", "hosted_by", "cover_photo_url", "external_link",
  "source", "is_featured", "partner_slug",
].join(",");

// Same horizon the crawler ingests and the apps list (4 months ahead).
const WINDOW_MONTHS = 4;

export interface UpcomingEvents {
  /** is_featured, any host, soonest first. */
  featured: EventView[];
  /** partner_slug set, soonest first. May include featured events too. */
  partnerEvents: EventView[];
}

export async function getUpcomingEvents(now = new Date()): Promise<UpcomingEvents> {
  const until = new Date(now);
  until.setMonth(until.getMonth() + WINDOW_MONTHS);
  // An event stays listed until it ends, not just until it starts.
  const params = new URLSearchParams({
    select: COLUMNS,
    or: `(event_end_datetime.gte.${now.toISOString()},and(event_end_datetime.is.null,event_datetime.gte.${now.toISOString()}))`,
    event_datetime: `lte.${until.toISOString()}`,
    and: "(or(is_featured.eq.true,partner_slug.not.is.null))",
    order: "event_datetime.asc,id.asc",
    limit: "400",
  });
  const rows = await restSelect<EventRow>("events", params);
  const views = rows.map((r) => toEventView(r, now));
  return {
    featured: views.filter((e) => e.featured),
    partnerEvents: views.filter((e) => e.partnerSlug),
  };
}

/** Any event by id, past or future — detail pages stay reachable after the date. */
export async function getEventById(id: number, now = new Date()): Promise<EventView | null> {
  const params = new URLSearchParams({ select: COLUMNS, id: `eq.${id}`, limit: "1" });
  const [row] = await restSelect<EventRow>("events", params);
  return row ? toEventView(row, now) : null;
}

/** A few more upcoming events from the same partner, for the detail page. */
export async function getMoreFromPartner(
  partnerSlug: string,
  excludeId: number,
  now = new Date(),
): Promise<EventView[]> {
  const params = new URLSearchParams({
    select: COLUMNS,
    partner_slug: `eq.${partnerSlug}`,
    event_datetime: `gte.${now.toISOString()}`,
    id: `neq.${excludeId}`,
    order: "event_datetime.asc",
    limit: "3",
  });
  const rows = await restSelect<EventRow>("events", params);
  return rows.map((r) => toEventView(r, now));
}
