import { getPartnerBySlug } from "../partners";
import type { EventRow, EventView } from "./types";

// Every event is in Metro Vancouver; the DB stores UTC instants.
export const EVENTS_TZ = "America/Vancouver";

const fmt = (d: Date, opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: EVENTS_TZ, ...opts }).format(d);

// en-CA writes "a.m." / "Sept." — normalise to "AM" / "Sep" for the UI.
const clock = (d: Date) =>
  fmt(d, { hour: "numeric", minute: "2-digit" }).replace(/\s?a\.m\./i, " AM").replace(/\s?p\.m\./i, " PM");
const shortMonth = (d: Date) => fmt(d, { month: "short" }).replace(".", "").slice(0, 3);

/** YYYY-MM-DD on the Pacific calendar. */
export function pacificDayKey(d: Date): string {
  return fmt(d, { year: "numeric", month: "2-digit", day: "2-digit" });
}

export function slugify(title: string): string {
  return title
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/g, "");
}

/**
 * How a partner is named on /events. Full names, because newcomers don't know
 * "BNH" or "VPL"; SFU is the exception — its short name is the public one.
 */
export function partnerLabel(partner: { slug: string; name: string; shortName: string }): string {
  return partner.slug === "sfu" ? partner.shortName : partner.name;
}

/**
 * "Department · Partner", collapsed to one name when the host already names
 * the partner. Keyed on partner_slug, not hosted_by, because hosted_by is often
 * a department ("International Services for Students") or a person.
 */
function hostLine(row: EventRow): string | null {
  const host = row.hosted_by?.trim() || null;
  const partner = row.partner_slug ? getPartnerBySlug(row.partner_slug) : undefined;
  if (!partner) return host;
  if (!host) return partner.name;
  const names = [partner.name, partner.shortName].map((n) => n.toLowerCase());
  if (names.some((n) => host.toLowerCase().includes(n))) return host;
  return `${host} · ${partnerLabel(partner)}`;
}

function sourceLabel(row: EventRow): string | null {
  if (row.partner_slug) {
    const partner = getPartnerBySlug(row.partner_slug);
    if (partner) return partnerLabel(partner);
  }
  if (!row.external_link) return null;
  try {
    return new URL(row.external_link).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

/** Only http(s) registration links are rendered (the crawler already guards this). */
function safeLink(url: string | null): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:" ? u.href : null;
  } catch {
    return null;
  }
}

const TYPE_LABEL = { "in-person": "In person", online: "Online", hybrid: "Hybrid" } as const;

export function toEventView(row: EventRow, now = new Date()): EventView {
  const start = new Date(row.event_datetime);
  const end = row.event_end_datetime ? new Date(row.event_end_datetime) : null;
  const slug = slugify(row.title) || "event";
  return {
    id: row.id,
    slug,
    href: `/events/${row.id}-${slug}`,
    title: row.title,
    description: row.description,
    startIso: start.toISOString(),
    endIso: end?.toISOString() ?? null,
    dayKey: pacificDayKey(start),
    day: fmt(start, { day: "numeric" }),
    month: shortMonth(start),
    weekday: fmt(start, { weekday: "short" }).replace(".", ""),
    weekdayLong: fmt(start, { weekday: "long" }),
    dateLabel: `${fmt(start, { weekday: "short" }).replace(".", "")}, ${shortMonth(start)} ${fmt(start, { day: "numeric" })}`,
    timeLabel: end ? `${clock(start)} – ${clock(end)}` : clock(start),
    location: row.event_type === "online" ? "Online" : row.location,
    address: row.address,
    type: row.event_type,
    typeLabel: TYPE_LABEL[row.event_type] ?? "In person",
    genre: row.genre && row.genre !== "Uncategorized" ? row.genre : null,
    host: hostLine(row),
    partnerSlug: row.partner_slug,
    cover: row.cover_photo_url,
    link: safeLink(row.external_link),
    sourceLabel: sourceLabel(row),
    featured: row.is_featured,
    isPast: (end ?? start).getTime() < now.getTime(),
  };
}

/**
 * Splits a crawler description into paragraphs. Blank lines always break; a
 * single newline breaks only after sentence-ending punctuation, because some
 * feeds (VPL) hard-wrap mid-sentence ("Meet\nnew friends and practice").
 */
export function toParagraphs(text: string | null): string[] {
  if (!text) return [];
  return text
    .replace(/\r\n?/g, "\n")
    .split(/\n\s*\n/)
    .flatMap((block) => block.replace(/([^.!?:)\n])\n(?=\S)/g, "$1 ").split("\n"))
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

export interface AgendaGroup {
  key: string;
  label: string;
  events: EventView[];
}

/**
 * This week (through Sunday) / Next week / then one group per month, on the
 * Pacific calendar. Input must be sorted by start time.
 */
export function groupAgenda(events: EventView[], now = new Date()): AgendaGroup[] {
  const todayKey = pacificDayKey(now);
  const today = new Date(`${todayKey}T00:00:00Z`);
  const daysToMonday = ((7 - today.getUTCDay()) % 7) + 1;
  const weekEnd = new Date(today.getTime() + daysToMonday * 864e5);
  const nextWeekEnd = new Date(weekEnd.getTime() + 7 * 864e5);
  const groups = new Map<string, AgendaGroup>();
  for (const e of events) {
    const d = new Date(`${e.dayKey}T00:00:00Z`);
    let key: string;
    let label: string;
    if (d < weekEnd) [key, label] = ["this-week", "This week"];
    else if (d < nextWeekEnd) [key, label] = ["next-week", "Next week"];
    else {
      key = e.dayKey.slice(0, 7);
      label = d.toLocaleDateString("en-CA", { month: "long", timeZone: "UTC" });
    }
    if (!groups.has(key)) groups.set(key, { key, label, events: [] });
    groups.get(key)!.events.push(e);
  }
  return [...groups.values()];
}
