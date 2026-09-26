# Design decisions

Keep history here; keep `DESIGN.md` current.

| ID | Date | Status | Decision | Why | Evidence | Supersedes |
|---|---|---|---|---|---|---|
| D-001 | 2026-09-25 | accepted | D1 page composition = **B · Agenda**: featured picks on the hero's ink band; partner events as an agenda grouped This week / Next week / month with a date column; calendar in the sticky sidebar is the same date system. | Savar chose B. Events are chosen by date; the agenda scales to 50+ events on a phone; small list images hide the repetitive source banners (VPL). | `.design/experiments/r1/b-agenda.html`, `.design/evidence/r1/b-agenda-1440.png`, `b-agenda-390.png` | - |
| D-002 | 2026-09-25 | rejected | A · Spotlight (lead featured card + 2-col card grid). | Dates hard to scan at ~50 cards; large grids expose repeated source banners. | `.design/evidence/r1/a-spotlight-1440.png` | - |
| D-003 | 2026-09-25 | rejected | C · Front page (featured stack inside the hero, 3-col grid). | Busiest hero; photo loses its role; sidebar squeezes the grid. | `.design/evidence/r1/c-frontpage-1440.png` | - |
| D-004 | 2026-09-25 | proposed | Below 1100px the sidebar stays above the list (as in the approved B mockup), but at ≤700px the calendar folds to a "Pick a date" line and the partner list is hidden. | Independent review N-1: with the full calendar first, the first event sat 2.0 screens down at 390px and 2.7 at 320px. Folding keeps the date lens one tap away. Pending Savar's confirmation. | `.design/reviews/events-2026-09-25-r1.md` N-1 | - |
| D-005 | 2026-09-25 | accepted | `--color-events-faint` #8a8784 → #6b6763; hero eyebrow #ff8a6b → #ffb39e; flat phone scrim. | Review blocker: 3.57:1 grey text and 3.4–3.9:1 eyebrow. Now 5.6:1 and ≥5.09:1. | `_review-hero.mjs` re-run | - |
