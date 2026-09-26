import type { EventView } from '../events/types';

interface EventLdArgs {
  event: EventView;
  canonicalUrl: string;
  organizerName: string | null;
  organizerUrl: string | null;
}

const ATTENDANCE = {
  'in-person': 'https://schema.org/OfflineEventAttendanceMode',
  online: 'https://schema.org/OnlineEventAttendanceMode',
  hybrid: 'https://schema.org/MixedEventAttendanceMode',
} as const;

// schema.org Event for /events/[event]. Price is deliberately omitted: the
// crawler has no price field, so claiming `offers.price: 0` would be a guess.
export function eventLd({ event, canonicalUrl, organizerName, organizerUrl }: EventLdArgs) {
  const place = {
    '@type': 'Place',
    name: event.location,
    address: {
      '@type': 'PostalAddress',
      ...(event.address ? { streetAddress: event.address } : {}),
      addressRegion: 'BC',
      addressCountry: 'CA',
    },
  };
  const virtual = { '@type': 'VirtualLocation', url: event.link ?? canonicalUrl };
  const location =
    event.type === 'online' ? virtual : event.type === 'hybrid' ? [place, virtual] : place;

  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    url: canonicalUrl,
    startDate: event.startIso,
    ...(event.endIso ? { endDate: event.endIso } : {}),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: ATTENDANCE[event.type],
    location,
    ...(event.cover ? { image: [event.cover] } : {}),
    ...(event.description ? { description: event.description.slice(0, 500) } : {}),
    ...(organizerName
      ? { organizer: { '@type': 'Organization', name: organizerName, ...(organizerUrl ? { url: organizerUrl } : {}) } }
      : {}),
  };
}
