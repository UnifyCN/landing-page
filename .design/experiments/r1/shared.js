// Shared render helpers for r1. Every option uses the same card anatomy, filter
// state and sidebar; the option file decides composition only.
const D = window.EVENTS;
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

const ICON = {
  host: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2.5 14V4.5l5.5-2.5 5.5 2.5V14M6 14v-3.5h4V14M1.5 14h13" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  time: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="6"/><path d="M8 4.8V8l2.2 1.4" stroke-linecap="round"/></svg>',
  date: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="12" height="11" rx="2"/><path d="M5 1.5v3M11 1.5v3M2 7h12" stroke-linecap="round"/></svg>',
  pin: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 14.5s4.5-4.1 4.5-7.5a4.5 4.5 0 1 0-9 0c0 3.4 4.5 7.5 4.5 7.5Z"/><circle cx="8" cy="7" r="1.6"/></svg>',
  star: '<svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor"><path d="M6 .8l1.6 3.3 3.6.5-2.6 2.5.6 3.6L6 9l-3.2 1.7.6-3.6L.8 4.6l3.6-.5z"/></svg>',
};
const PLACEHOLDER = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 9"><rect width="16" height="9" fill="#f6f3ef"/><circle cx="12.5" cy="2.5" r="3.5" fill="#fbece7"/></svg>');

function badges(e) {
  return `<div class="badges"><span class="badge type">${e.type}</span>${e.genre ? `<span class="badge">${e.genre}</span>` : ""}</div>`;
}

function meta(e, { withDate = true } = {}) {
  return `<div class="meta">
    <p class="host">${ICON.host}<span class="clamp1">${esc(e.host)}</span></p>
    ${withDate ? `<p>${ICON.date}<span>${e.weekday}, ${e.month} ${e.day} · ${e.time}</span></p>` : `<p>${ICON.time}<span>${e.weekday} · ${e.time}</span></p>`}
    <p>${ICON.pin}<span class="clamp1">${esc(e.location)}</span></p>
  </div>`;
}

/** Vertical card — the web-app EventCard anatomy. */
function card(e, { featured = false } = {}) {
  return `<a class="card${featured ? " card--feat" : ""}" href="#event-${e.id}">
    <div class="media">
      <img src="${esc(e.cover || PLACEHOLDER)}" alt="" loading="lazy" onerror="this.src='${PLACEHOLDER}'">
      <div class="datebadge"><b>${e.day}</b><span>${e.month}</span></div>
      ${featured ? `<span class="feat-tag">${ICON.star} Featured</span>` : ""}
    </div>
    <div class="body">
      <h3 class="title clamp2">${esc(e.title)}</h3>
      ${badges(e)}
      ${meta(e)}
    </div>
  </a>`;
}

/** Horizontal row card — same fields, image left. Used by the agenda option. */
function rowCard(e) {
  return `<a class="card card--row" href="#event-${e.id}">
    <div class="media"><img src="${esc(e.cover || PLACEHOLDER)}" alt="" loading="lazy" onerror="this.src='${PLACEHOLDER}'"></div>
    <div class="body">
      <h3 class="title clamp2">${esc(e.title)}</h3>
      ${badges(e)}
      ${meta(e, { withDate: false })}
    </div>
  </a>`;
}

// ---- Filter state (genre AND partner AND day) ----
const state = { genre: null, partner: null, day: null };
const listeners = [];
const onChange = (fn) => listeners.push(fn);
function set(k, v) { state[k] = state[k] === v ? null : v; listeners.forEach((f) => f()); }
function clearAll() { state.genre = state.partner = state.day = null; listeners.forEach((f) => f()); }
function filtered() {
  return D.partnerEvents.filter((e) =>
    (!state.genre || e.genre === state.genre) &&
    (!state.partner || e.partner === state.partner) &&
    (!state.day || e.dayKey === state.day));
}

function renderChips(el) {
  const genres = [...new Set(D.partnerEvents.map((e) => e.genre).filter(Boolean))].sort();
  const partners = [...new Set(D.partnerEvents.map((e) => e.partner))];
  const draw = () => {
    el.innerHTML = `
      <div class="filter-row"><span class="filter-label">Topic</span><div class="chips">
        <button class="chip ${!state.genre ? "on" : ""}" data-k="genre" data-v="">All topics</button>
        ${genres.map((g) => `<button class="chip ${state.genre === g ? "on" : ""}" data-k="genre" data-v="${g}">${g}</button>`).join("")}
      </div></div>
      <div class="filter-row"><span class="filter-label">Partner</span><div class="chips">
        <button class="chip ${!state.partner ? "on" : ""}" data-k="partner" data-v="">All partners</button>
        ${partners.map((p) => `<button class="chip ${state.partner === p ? "on" : ""}" data-k="partner" data-v="${p}">${D.partners[p].short === "SFU" ? "SFU" : D.partners[p].name}</button>`).join("")}
      </div></div>`;
  };
  el.addEventListener("click", (ev) => {
    const b = ev.target.closest(".chip"); if (!b) return;
    if (!b.dataset.v) { state[b.dataset.k] = null; listeners.forEach((f) => f()); } else set(b.dataset.k, b.dataset.v);
  });
  onChange(draw); draw();
}

// ---- Calendar ----
function renderCalendar(el) {
  const days = new Set(D.partnerEvents.map((e) => e.dayKey));
  const todayKey = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Vancouver", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  let [y, m] = todayKey.split("-").map(Number); m -= 1;
  const draw = () => {
    const first = new Date(y, m, 1), n = new Date(y, m + 1, 0).getDate(), lead = first.getDay();
    const label = first.toLocaleDateString("en-CA", { month: "long", year: "numeric" });
    let cells = ["S", "M", "T", "W", "T", "F", "S"].map((d) => `<div class="dow">${d}</div>`).join("");
    for (let i = 0; i < lead; i++) cells += "<div></div>";
    for (let d = 1; d <= n; d++) {
      const key = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const has = days.has(key);
      cells += `<button ${has ? "" : "disabled"} data-day="${key}" class="${has ? "has" : ""} ${key === todayKey ? "today" : ""} ${state.day === key ? "sel" : ""}" aria-label="${key}${has ? ", has events" : ""}">${d}</button>`;
    }
    el.innerHTML = `<div class="cal-head"><button data-nav="-1" aria-label="Previous month">‹</button><b>${label}</b><button data-nav="1" aria-label="Next month">›</button></div><div class="cal">${cells}</div>`;
  };
  el.addEventListener("click", (ev) => {
    const nav = ev.target.closest("[data-nav]");
    if (nav) { m += Number(nav.dataset.nav); if (m < 0) { m = 11; y--; } if (m > 11) { m = 0; y++; } draw(); return; }
    const b = ev.target.closest("[data-day]"); if (b && !b.disabled) set("day", b.dataset.day);
  });
  onChange(draw); draw();
}

function renderPartners(el) {
  const LOGO = { sfu: "sfu.png", "capilano-university": "capilano_university.avif", "burnaby-neighbourhood-house": "burnaby_neighbourhood_house.avif", "vancouver-public-library": "vancouver_public_library.png", "surrey-libraries": "surrey_libraries.png" };
  const counts = {};
  D.partnerEvents.forEach((e) => (counts[e.partner] = (counts[e.partner] || 0) + 1));
  el.innerHTML = `<h3>Our event partners</h3>` + Object.entries(D.partners).map(([slug, p]) => `
    <a class="partner" href="#partners/${slug}"><span class="logo"><img src="assets/${LOGO[slug]}" alt=""></span>
    <span><b>${p.name}</b><small>${counts[slug] ? `${counts[slug]} upcoming events` : "No upcoming events"}</small></span></a>`).join("") +
    `<a class="viewall" href="#partners">View all partners →</a>`;
}

function heroInner() {
  return `<p class="eyebrow">Unify events</p>
    <h1 class="h1">Free Events for Newcomers in Canada<span class="dot">.</span></h1>
    <p class="lede">Workshops, info sessions, and English lessons for people settling in Canada. Learn, connect, and find your community. No experience or fees required.</p>`;
}
function statsHTML() {
  return `<div class="stats">
    <div class="stat"><b>35+</b><span>Events hosted</span></div>
    <div class="stat"><b>450+</b><span>Newcomers joined</span></div>
    <div class="stat"><b>18</b><span>Community partners</span></div>
    <div class="stat"><b>Free</b><span>Always, no fee</span></div></div>`;
}
function navHTML() {
  return `<div class="nav"><div class="pill"><img src="assets/new-unify-logo-256.png" alt="Unify Social">
    <ul><li>Home</li><li>About<span class="caret">▾</span></li><li class="on">Events</li><li>Resources<span class="caret">▾</span></li></ul>
    <span class="cta">Download Unify →</span><span class="ham" aria-hidden="true"></span></div></div>`;
}
