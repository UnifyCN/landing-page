// Shapes for public.events (shared Unify Supabase DB). Column source of truth:
// Unify-Web-App supabase/migrations (events: 20260518100500_community.sql,
// crawler columns: 20260722120000_events_crawler.sql, featured + partner:
// 20260925120000_events_featured_partner.sql).

export type EventType = "in-person" | "online" | "hybrid";

/** Crawler genre values (Unify-Web-App events-crawler lib/types.ts EventGenre). */
export type EventGenre =
  | "Employment"
  | "Language"
  | "Housing"
  | "Finance"
  | "Documentation"
  | "Health"
  | "Family"
  | "Education"
  | "Socials"
  | "Uncategorized";

/** The columns this site selects. */
export interface EventRow {
  id: number;
  title: string;
  description: string | null;
  event_datetime: string;
  event_end_datetime: string | null;
  location: string;
  address: string | null;
  event_type: EventType;
  genre: EventGenre | null;
  hosted_by: string | null;
  cover_photo_url: string | null;
  external_link: string | null;
  source: string | null;
  is_featured: boolean;
  partner_slug: string | null;
}

/** An event shaped for rendering: Pacific-time labels, host line, partner. */
export interface EventView {
  id: number;
  slug: string;
  href: string;
  title: string;
  description: string | null;
  startIso: string;
  endIso: string | null;
  /** YYYY-MM-DD on the Pacific calendar — the filter/calendar key. */
  dayKey: string;
  day: string;
  month: string;
  weekday: string;
  weekdayLong: string;
  /** "Sun, Sep 27" */
  dateLabel: string;
  /** "11:30 AM – 12:30 PM" */
  timeLabel: string;
  location: string;
  address: string | null;
  type: EventType;
  typeLabel: string;
  /** null when Uncategorized — never shown as a tag. */
  genre: Exclude<EventGenre, "Uncategorized"> | null;
  /** "International Services for Students · SFU", or one name when they match. */
  host: string | null;
  partnerSlug: string | null;
  cover: string | null;
  link: string | null;
  /** "SFU", "Vancouver Public Library", or the link's hostname. */
  sourceLabel: string | null;
  featured: boolean;
  isPast: boolean;
}
