// Turns raw.json (live Supabase export) into events.js for the r1 mockups.
// Invariant across options A–C: same events, same featured picks, same host lines.
import { readFileSync, writeFileSync } from "node:fs";

const dir = new URL(".", import.meta.url).pathname;
const raw = JSON.parse(readFileSync(dir + "raw.json", "utf8")).rows;

const PARTNERS = {
  sfu: { name: "Simon Fraser University", short: "SFU" },
  "burnaby-neighbourhood-house": { name: "Burnaby Neighbourhood House", short: "Burnaby Neighbourhood House" },
  "vancouver-public-library": { name: "Vancouver Public Library", short: "Vancouver Public Library" },
  "surrey-libraries": { name: "Surrey Libraries", short: "Surrey Libraries" },
  "capilano-university": { name: "Capilano University", short: "Capilano University" },
};
const SOURCE_NAMES = { "crawler:nvcl": "North Vancouver City Library", "crawler:mosaic": "MOSAIC" };

const TZ = "America/Vancouver";
const fmt = (d, o) => new Intl.DateTimeFormat("en-CA", { timeZone: TZ, ...o }).format(d);

function hostLine(e) {
  const host = e.hosted_by?.trim();
  const partner = e.partner_slug ? PARTNERS[e.partner_slug].short : SOURCE_NAMES[e.source];
  if (!host || host === partner || PARTNERS[e.partner_slug]?.name === host) return partner ?? host;
  if (!partner || host.includes(partner)) return host;
  return `${host} · ${partner}`;
}

const events = raw.map((e) => {
  const d = new Date(e.event_datetime.replace(" ", "T").replace("+00", "Z"));
  const end = e.event_end_datetime ? new Date(e.event_end_datetime.replace(" ", "T").replace("+00", "Z")) : null;
  const time = fmt(d, { hour: "numeric", minute: "2-digit" }).replace(/\./g, "").toUpperCase();
  const endTime = end ? fmt(end, { hour: "numeric", minute: "2-digit" }).replace(/\./g, "").toUpperCase() : null;
  return {
    id: e.id,
    title: e.title,
    iso: d.toISOString(),
    dayKey: fmt(d, { year: "numeric", month: "2-digit", day: "2-digit" }),
    day: fmt(d, { day: "numeric" }),
    month: fmt(d, { month: "short" }).replace(".", ""),
    weekday: fmt(d, { weekday: "short" }).replace(".", ""),
    time: endTime ? `${time} – ${endTime}` : time,
    location: e.event_type === "online" ? "Online" : e.location,
    type: e.event_type === "online" ? "Online" : e.event_type === "hybrid" ? "Hybrid" : "In person",
    genre: e.genre === "Uncategorized" ? null : e.genre,
    host: hostLine(e),
    partner: e.partner_slug,
    partnerName: e.partner_slug ? PARTNERS[e.partner_slug].name : null,
    cover: e.cover_photo_url,
    link: e.external_link,
    featured: false,
  };
});

// Sample featured picks (no row is is_featured yet): one per host type.
for (const pick of [
  (e) => e.host?.includes("MOSAIC"),
  (e) => e.partner === "sfu",
  (e) => e.host?.includes("North Vancouver City Library"),
]) {
  const hit = events.find((e) => !e.featured && pick(e));
  if (hit) hit.featured = true;
}

const partnerEvents = events.filter((e) => e.partner);
const featured = events.filter((e) => e.featured);
writeFileSync(
  dir + "events.js",
  `window.EVENTS = ${JSON.stringify({ featured, partnerEvents, partners: PARTNERS }, null, 1)};\n`,
);
console.log(`featured ${featured.length}, partner events ${partnerEvents.length}`);
