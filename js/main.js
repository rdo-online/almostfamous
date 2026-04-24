'use strict';

/* =========================================================
   Almost Famous GTA — main.js
   ========================================================= */

// ── Global state ──────────────────────────────────────────
const AF = {
  gigs:    [],
  artists: [],
  countdownIntervals: [],
  lightboxImages: [],
  lightboxIndex:  0,
};

// ── Fallback data (works with file:// protocol) ───────────
const FALLBACK_GIGS = [
  { id: '2026-04-17', date: '2026-04-17', time: '7:00 PM',  venue: 'Royal Canadian Legion, Branch 101', city: 'Etobicoke',    address: '3850 Lake Shore Blvd W, Etobicoke, ON M8W 1R3',   phone: '(416) 255-4381', upcoming: true,  private: false },
  { id: '2026-02-06', date: '2026-02-06', time: '9:00 PM',  venue: "Cuchulainn's Irish Pub",            city: 'Streetsville', address: '158 Queen St S, Mississauga, ON L5M 1K8',          phone: '(905) 821-3790', upcoming: false, private: false },
  { id: '2026-01-30', date: '2026-01-30', time: '7:00 PM',  venue: 'Royal Canadian Legion, Branch 101', city: 'Etobicoke',    address: '3850 Lake Shore Blvd W, Etobicoke, ON M8W 1R3',   phone: '(416) 255-4381', upcoming: false, private: false },
  { id: '2025-12-12', date: '2025-12-12', time: '9:00 PM',  venue: "Cuchulainn's Irish Pub",            city: 'Streetsville', address: '158 Queen St S, Mississauga, ON L5M 1K8',          phone: '(905) 821-3790', upcoming: false, private: false },
  { id: '2025-12-05', date: '2025-12-05', time: '7:00 PM',  venue: 'Royal Canadian Legion, Branch 101', city: 'Etobicoke',    address: '3850 Lake Shore Blvd W, Etobicoke, ON M8W 1R3',   phone: '(416) 255-4381', upcoming: false, private: false },
  { id: '2025-11-08', date: '2025-11-08', time: '',          venue: 'Private Party',                    city: 'Mississauga',  address: '',                                                  phone: '',               upcoming: false, private: true  },
  { id: '2025-10-30', date: '2025-10-30', time: '8:00 PM',  venue: 'Smokeshow BBQ & Brew',              city: 'Toronto',      address: '744 Mt Pleasant Rd, Toronto, ON M4S 2N6',           phone: '(416) 901-7469', upcoming: false, private: false },
  { id: '2025-10-17', date: '2025-10-17', time: '9:00 PM',  venue: 'South Shore Bar & Grill',           city: 'Toronto',      address: '264 Browns Line, Toronto, ON',                      phone: '(416) 704-1820', upcoming: false, private: false },
  { id: '2025-10-09', date: '2025-10-09', time: '8:00 PM',  venue: 'Smokeshow BBQ & Brew',              city: 'Toronto',      address: '744 Mt Pleasant Rd, Toronto, ON M4S 2N6',           phone: '(416) 901-7469', upcoming: false, private: false },
  { id: '2025-10-03', date: '2025-10-03', time: '7:00 PM',  venue: 'Royal Canadian Legion, Branch 101', city: 'Etobicoke',    address: '3850 Lake Shore Blvd W, Etobicoke, ON M8W 1R3',   phone: '(416) 255-4381', upcoming: false, private: false },
  { id: '2025-09-26', date: '2025-09-26', time: '8:00 PM',  venue: 'The BLK Swan',                     city: 'Burlington',   address: '4040 Palladium Way, Burlington, ON',                phone: '',               upcoming: false, private: false },
  { id: '2025-09-05', date: '2025-09-05', time: '9:00 PM',  venue: "Cuchulainn's Irish Pub",            city: 'Streetsville', address: '158 Queen St S, Mississauga, ON L5M 1K8',          phone: '(905) 821-3790', upcoming: false, private: false },
  { id: '2025-08-15', date: '2025-08-15', time: '9:00 PM',  venue: 'South Shore Bar & Grill',           city: 'Toronto',      address: '264 Browns Line, Toronto, ON',                      phone: '(416) 704-1820', upcoming: false, private: false },
  { id: '2025-08-08', date: '2025-08-08', time: '7:00 PM',  venue: 'Royal Canadian Legion, Branch 101', city: 'Etobicoke',    address: '3850 Lake Shore Blvd W, Etobicoke, ON M8W 1R3',   phone: '(416) 255-4381', upcoming: false, private: false },
  { id: '2025-08-01', date: '2025-08-01', time: '8:00 PM',  venue: 'The BLK Swan',                     city: 'Burlington',   address: '4040 Palladium Way, Burlington, ON',                phone: '',               upcoming: false, private: false },
  { id: '2025-07-11', date: '2025-07-11', time: '9:00 PM',  venue: "Cuchulainn's Irish Pub",            city: 'Streetsville', address: '158 Queen St S, Mississauga, ON L5M 1K8',          phone: '(905) 821-3790', upcoming: false, private: false },
  { id: '2025-06-14', date: '2025-06-14', time: '10:00 PM', venue: "Archibald's Pub",                   city: 'Richmond Hill',address: '8950 Yonge St, Richmond Hill, ON L4C 6Z7',         phone: '(905) 889-0235', upcoming: false, private: false },
  { id: '2025-05-30', date: '2025-05-30', time: '9:00 PM',  venue: 'South Shore Bar & Grill',           city: 'Toronto',      address: '264 Browns Line, Toronto, ON',                      phone: '(416) 704-1820', upcoming: false, private: false },
  { id: '2025-05-24', date: '2025-05-24', time: '',          venue: 'Private Party',                    city: 'Burlington',   address: '',                                                  phone: '',               upcoming: false, private: true  },
  { id: '2025-05-16', date: '2025-05-16', time: '9:00 PM',  venue: "Cuchulainn's Irish Pub",            city: 'Streetsville', address: '158 Queen St S, Mississauga, ON L5M 1K8',          phone: '(905) 821-3790', upcoming: false, private: false },
  { id: '2025-04-25', date: '2025-04-25', time: '9:00 PM',  venue: 'South Shore Bar & Grill',           city: 'Toronto',      address: '264 Browns Line, Toronto, ON',                      phone: '(416) 704-1820', upcoming: false, private: false },
  { id: '2025-03-21', date: '2025-03-21', time: '9:00 PM',  venue: "Cuchulainn's Irish Pub",            city: 'Streetsville', address: '158 Queen St S, Mississauga, ON L5M 1K8',          phone: '(905) 821-3790', upcoming: false, private: false },
  { id: '2025-03-01', date: '2025-03-01', time: '8:00 PM',  venue: 'Carrigan Arms',                    city: 'Burlington',   address: '2025 Upper Middle Road, Burlington, ON',            phone: '(905) 332-6131', upcoming: false, private: false },
  { id: '2025-02-28', date: '2025-02-28', time: '7:00 PM',  venue: 'Royal Canadian Legion, Branch 101', city: 'Etobicoke',    address: '3850 Lake Shore Blvd W, Etobicoke, ON M8W 1R3',   phone: '(416) 255-4381', upcoming: false, private: false },
  { id: '2025-02-08', date: '2025-02-08', time: '10:00 PM', venue: "Archibald's Pub",                   city: 'Richmond Hill',address: '8950 Yonge St, Richmond Hill, ON L4C 6Z7',         phone: '(905) 889-0235', upcoming: false, private: false },
  { id: '2025-01-17', date: '2025-01-17', time: '9:00 PM',  venue: 'South Shore Bar & Grill',           city: 'Toronto',      address: '264 Browns Line, Toronto, ON',                      phone: '(416) 704-1820', upcoming: false, private: false },
];

const FALLBACK_ARTISTS = [
  'Depeche Mode','Jimmy Eat World','Blur','The Cult','Joe Jackson',
  'The Killers','The Tragically Hip','A Flock of Seagulls','Simple Minds',
  'The Beatles','George Michael','Gary Numan','Bruno Mars','The Cure',
  'David Bowie','The Clash','Billy Idol','Pet Shop Boys','Danko Jones',
  'The Escape Club','Wild Cherry','Erasure','Santana','The Charlatans',
  'Collective Soul','Soft Cell','Dead Or Alive','House Of Pain','Steppenwolf',
  'Elvis Costello','The Black Crowes','The Proclaimers','Neil Diamond','B-52s',
  'Young MC','Pat Benatar','Stone Temple Pilots','Radiohead','U2',
  'Lenny Kravitz','ZZ Top','The Glorious Sons',
];

// ── Data loading ──────────────────────────────────────────
async function loadData() {
  // Fetch gigs and artists independently so one failure doesn't kill the other
  try {
    const gigsRes = await fetch('data/gigs.json');
    if (!gigsRes.ok) throw new Error('gigs HTTP ' + gigsRes.status);
    AF.gigs = await gigsRes.json();
  } catch (_) {
    AF.gigs = FALLBACK_GIGS;
  }
  try {
    const artistsRes = await fetch('data/artists.json');
    if (!artistsRes.ok) throw new Error('artists HTTP ' + artistsRes.status);
    AF.artists = await artistsRes.json();
  } catch (_) {
    AF.artists = FALLBACK_ARTISTS;
  }
}

// ── Pretext wrappers (graceful fallback) ──────────────────
function ptPrepare(text, opts) {
  if (window.Pretext) return Pretext.prepare(text, opts);
  return { _text: text, _fallback: true };
}
function ptLayout(prep, maxWidth, lh) {
  if (window.Pretext && !prep._fallback) return Pretext.layout(prep, maxWidth, lh);
  return { height: (lh || 20), lineCount: 1 };
}
function ptWalkLineRanges(prep, maxWidth, lh, cb) {
  if (window.Pretext && !prep._fallback) {
    Pretext.walkLineRanges(prep, maxWidth, lh, cb);
  } else {
    cb(0, 1, maxWidth, prep._text);
  }
}

// ── Helpers ───────────────────────────────────────────────
function pad2(n) { return String(n).padStart(2, '0'); }

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', {
    weekday: 'short', year: 'numeric', month: 'long', day: 'numeric',
  });
}

function gigDate(gig) {
  const [year, month, day] = gig.date.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function todayAtMidnight() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function isUpcomingGig(gig, today = todayAtMidnight()) {
  return gigDate(gig) >= today;
}

function sortGigsSoonestFirst(a, b) {
  return gigDate(a) - gigDate(b);
}

function sortGigsNewestFirst(a, b) {
  return gigDate(b) - gigDate(a);
}

function parse12to24(t) {
  // "7:00 PM" → "19:00:00"
  const [timePart, period] = t.trim().split(' ');
  let [h, m] = timePart.split(':').map(Number);
  if (period === 'PM' && h !== 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  return `${pad2(h)}:${pad2(m)}:00`;
}

function buildCalUrl(gig) {
  const start = new Date(`${gig.date}T${parse12to24(gig.time)}`);
  const end   = new Date(start.getTime() + 3 * 3600 * 1000);
  const fmt   = d => d.toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z';
  return `https://calendar.google.com/calendar/render?action=TEMPLATE` +
    `&text=${encodeURIComponent('Almost Famous GTA')}` +
    `&dates=${fmt(start)}/${fmt(end)}` +
    `&location=${encodeURIComponent(gig.address)}` +
    `&details=${encodeURIComponent('Almost Famous GTA Live Performance')}`;
}

function formatCountdown(targetDate) {
  const diff = targetDate - new Date();
  if (diff <= 0) return 'TONIGHT!';
  const days  = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins  = Math.floor((diff % 3600000)  / 60000);
  const secs  = Math.floor((diff % 60000)    / 1000);
  if (days > 0) return `${days}d ${pad2(hours)}h ${pad2(mins)}m ${pad2(secs)}s`;
  return `${pad2(hours)}h ${pad2(mins)}m ${pad2(secs)}s`;
}

// ── Navigation ────────────────────────────────────────────
function initNav() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

// ── Hero letter animation ─────────────────────────────────
function initHeroAnimation() {
  const title = document.getElementById('hero-title');
  if (!title) return;

  // Wrap each character in a span
  const raw = title.textContent;
  title.innerHTML = '';
  const letterSpans = [];

  for (const ch of raw) {
    const span = document.createElement('span');
    if (ch === ' ') {
      span.className = 'hero-letter hero-space';
      span.innerHTML = '&nbsp;';
    } else {
      span.className = 'hero-letter';
      span.textContent = ch;
      letterSpans.push(span);
    }
    title.appendChild(span);
  }

  // Use Pretext to measure each letter's natural position
  let letterRects = null;
  function measureLetters() {
    letterRects = letterSpans.map(s => {
      const r = s.getBoundingClientRect();
      const t = title.getBoundingClientRect();
      return { x: r.left - t.left, y: r.top - t.top };
    });
  }

  let scattering = false;

  function scatter() {
    if (scattering) return;
    scattering = true;

    if (!letterRects) measureLetters();

    // Prepare with Pretext if available
    if (window.Pretext) {
      const style = getComputedStyle(title);
      ptPrepare(raw.replace(/ /g, ''), {
        fontSize:   parseFloat(style.fontSize),
        fontFamily: style.fontFamily,
        fontWeight: style.fontWeight,
      });
    }

    // Scatter phase
    letterSpans.forEach((span, i) => {
      const angle    = Math.random() * Math.PI * 2;
      const dist     = 180 + Math.random() * 280;
      const dx       = Math.cos(angle) * dist;
      const dy       = Math.sin(angle) * dist;
      const rotation = (Math.random() - 0.5) * 900;
      const scale    = 0.2 + Math.random() * 0.5;
      span.style.transition = `transform ${0.35 + Math.random() * 0.15}s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.3s`;
      span.style.transform  = `translate(${dx}px,${dy}px) rotate(${rotation}deg) scale(${scale})`;
      span.style.opacity    = '0.15';
    });

    // Return phase
    setTimeout(() => {
      letterSpans.forEach((span, i) => {
        span.style.transition = `transform ${0.55 + i * 0.025}s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s`;
        span.style.transform  = 'translate(0,0) rotate(0deg) scale(1)';
        span.style.opacity    = '1';
      });
      setTimeout(() => { scattering = false; }, 1100);
    }, 500);
  }

  // Trigger on load
  setTimeout(scatter, 400);
  // Trigger on click
  title.addEventListener('click', scatter);
  title.title = 'Click to scatter!';
}

// ── Artist ticker ─────────────────────────────────────────
function initTicker() {
  const ticker = document.getElementById('artist-ticker');
  if (!ticker || !AF.artists.length) return;

  const inner = ticker.querySelector('.ticker-inner');
  if (!inner) return;

  // Build a single track worth of items
  function buildTrack() {
    const track = document.createElement('div');
    track.className = 'ticker-track';
    AF.artists.forEach(name => {
      const sp = document.createElement('span');
      sp.className = 'ticker-item';
      sp.textContent = name;
      track.appendChild(sp);
    });
    return track;
  }

  inner.innerHTML = '';
  const t1 = buildTrack();
  const t2 = buildTrack();
  inner.appendChild(t1);
  inner.appendChild(t2);

  // After items are in DOM, use Pretext to verify even spacing
  requestAnimationFrame(() => {
    if (window.Pretext) {
      const style   = getComputedStyle(t1.firstChild);
      const fs      = parseFloat(style.fontSize);
      const ff      = style.fontFamily;
      const vw      = window.innerWidth;
      let totalW    = 0;

      t1.querySelectorAll('.ticker-item').forEach(el => {
        const prep = Pretext.prepare(el.textContent, { fontSize: fs, fontFamily: ff });
        // walkLineRanges gives us the natural width of one line
        let w = 0;
        Pretext.walkLineRanges(prep, 9999, fs * 1.4, (s, e, lw) => { w = Math.max(w, lw); });
        el.style.minWidth = Math.ceil(w) + 'px';
        totalW += Math.ceil(w) + 64; // 64 = padding on each side
      });

      // Set animation duration proportional to content width
      const speed    = 80; // px/sec
      const duration = (totalW || t1.scrollWidth) / speed;
      t1.style.animationDuration = `${duration}s`;
      t2.style.animationDuration = `${duration}s`;
      t2.style.animationDelay    = `-${duration / 2}s`;
    } else {
      const trackW  = t1.scrollWidth;
      const speed   = 80;
      const dur     = trackW / speed;
      t1.style.animationDuration = `${dur}s`;
      t2.style.animationDuration = `${dur}s`;
      t2.style.animationDelay    = `-${dur / 2}s`;
    }
  });
}

// ── Tagline scatter / explosion effect ───────────────────
function initTaglineScatter() {
  const container = document.querySelector('.hotspot-container');
  if (!container) return;

  // Build the tagline container (centered line at rest)
  const tagline = document.createElement('div');
  tagline.className = 'tagline-container';

  // Each word with its explosion vector (% of container w/h)
  // Positive x = right, positive y = down
  const WORDS = [
    { t: 'rock',   vx: -30, vy: -26 },
    { t: '·',      vx:  -4, vy: -20 },
    { t: 'dance',  vx: -18, vy: -34 },
    { t: '·',      vx:   3, vy: -16 },
    { t: 'pop',    vx:  20, vy: -30 },
    { t: '·',      vx:   6, vy: -12 },
    { t: '80s',    vx:  28, vy: -24 },
    { t: '·',      vx: -12, vy:  18 },
    { t: '90s',    vx: -26, vy:  22 },
    { t: '·',      vx:   5, vy:  20 },
    { t: '00s',    vx:  18, vy:  28 },
    { t: 'and',    vx:  32, vy:  16 },
    { t: 'beyond', vx:  38, vy:  12 },
  ];

  const spans = WORDS.map(w => {
    const span = document.createElement('span');
    span.className = 'tagline-word';
    span.textContent = w.t;
    tagline.appendChild(span);
    return { el: span, vx: w.vx, vy: w.vy };
  });

  // "hover to explore" hint
  const hint = document.createElement('div');
  hint.className = 'tagline-hint';
  hint.textContent = 'hover to scatter';

  container.appendChild(tagline);
  container.appendChild(hint);

  let scattered = false;

  function scatter() {
    if (scattered) return;
    scattered = true;
    hint.classList.add('hidden');
    const cW = container.offsetWidth;
    const cH = container.offsetHeight;
    spans.forEach(s => {
      const tx = Math.round((s.vx / 100) * cW);
      const ty = Math.round((s.vy / 100) * cH);
      s.el.style.transition = 'transform 150ms ease-out, opacity 180ms ease-out';
      s.el.style.transform  = `translate(${tx}px, ${ty}px)`;
      s.el.style.opacity    = '0.12';
    });
  }

  function reassemble() {
    if (!scattered) return;
    scattered = false;
    spans.forEach(s => {
      s.el.style.transition = 'transform 600ms cubic-bezier(0.34,1.56,0.64,1), opacity 350ms ease';
      s.el.style.transform  = 'translate(0, 0)';
      s.el.style.opacity    = '1';
    });
    // Fade hint back in after words settle
    setTimeout(() => { hint.classList.remove('hidden'); }, 650);
  }

  // Desktop
  tagline.addEventListener('mouseenter', scatter);
  tagline.addEventListener('mouseleave', reassemble);

  // Mobile: tap tagline to scatter; tap elsewhere to reassemble
  tagline.addEventListener('touchstart', e => {
    e.stopPropagation();
    if (!scattered) scatter();
    else reassemble();
  }, { passive: true });

  document.addEventListener('touchstart', () => {
    if (scattered) reassemble();
  }, { passive: true });
}

// ── Stage modal system ────────────────────────────────────
function initStage() {
  const overlay = document.getElementById('stage-modal-overlay');
  if (!overlay) return;

  // Modal hotspots
  document.querySelectorAll('.hotspot[data-action="modal"]').forEach(el => {
    const handler = () => openStageModal(el.dataset.modal);
    el.addEventListener('click', handler);
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); }
    });
  });

  // Link hotspots
  document.querySelectorAll('.hotspot[data-action="link"]').forEach(el => {
    const handler = () => window.open(el.dataset.href, '_blank', 'noopener');
    el.addEventListener('click', handler);
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); }
    });
  });

  // Close on overlay click
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeStageModal();
  });
  overlay.querySelector('.stage-modal-close')
         ?.addEventListener('click', closeStageModal);
}

function openStageModal(type) {
  const overlay = document.getElementById('stage-modal-overlay');
  const content = document.getElementById('stage-modal-content');
  if (!overlay || !content) return;

  content.innerHTML = buildModalHTML(type);
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Kick off any countdowns inside the modal
  overlay.querySelectorAll('.countdown-timer[data-date]').forEach(el => {
    const target = new Date(el.dataset.date);
    const update = () => { el.textContent = formatCountdown(target); };
    update();
    const iv = setInterval(update, 1000);
    AF.countdownIntervals.push(iv);
  });
}

function closeStageModal() {
  const overlay = document.getElementById('stage-modal-overlay');
  if (!overlay) return;
  overlay.classList.remove('active');
  document.body.style.overflow = '';
  // Clear modal countdowns
  AF.countdownIntervals.forEach(clearInterval);
  AF.countdownIntervals = [];
}

function buildModalHTML(type) {
  switch (type) {
    case 'bio':
      return `
        <h2>About Almost Famous GTA</h2>
        <div class="badge-efc" style="margin-bottom:1.2rem">
          &#127942; EFC Talent Show &mdash; 1st Place &mdash; December 2020
        </div>
        <p>Did you know that Mississauga is home to former NHL coach and Hockey Night in Canada commentator Don Cherry, KFC&rsquo;s founder Colonel Sanders, and the world&rsquo;s oldest mayor Hazel &ldquo;Hurricane&rdquo; McCallion?</p>
        <p>You can add to that list now &mdash; the soon-to-be-famous rock cover band, Almost Famous GTA. You&rsquo;re welcome, Mississauga.</p>
        <p>Formed in early 2014, Almost Famous is a collection of guys and a gal who live and breathe live music. From David Bowie and The Clash to Bruno Mars and The Killers, from The Tragically Hip and U2 to Depeche Mode and Pat Benatar &mdash; if you know the words, we know the song.</p>
        <p>Our mission is simple: bring the fun, energy, and excitement back into live music &mdash; whether that&rsquo;s your favourite pub, a festival stage, a corporate event, or your wedding dance floor.</p>
        <p>Spanning rock, dance, and pop across the 80s, 90s, 00s and beyond, our massive repertoire keeps audiences dancing from the first song to the last. Our setlist is fully customizable to suit your crowd.</p>
        <p>We are Almost Famous: Rich, Richard, Donn, Paul, Jim and Vanessa.</p>
        <a href="mailto:almostfamousgta@gmail.com?subject=Booking%20Inquiry" class="btn btn-primary" style="margin-top:0.5rem">Contact Us</a>
      `;

    case 'shows': {
      const today = todayAtMidnight();
      const next = AF.gigs
        .filter(g => isUpcomingGig(g, today))
        .sort(sortGigsSoonestFirst)[0];
      if (!next) return `
        <h2>Upcoming Shows</h2>
        <p>No upcoming shows at this time. Check back soon!</p>
        <a href="shows.html" class="btn btn-primary" style="margin-top:0.5rem">View All Shows</a>
      `;
      const hasTime = next.time && next.time.trim();
      const dt      = hasTime ? `${next.date}T${parse12to24(next.time)}` : '';
      const calUrl  = hasTime ? buildCalUrl(next) : '';
      const mapsUrl = next.address
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(next.address)}`
        : '';
      return `
        <h2>Next Show</h2>
        <div class="modal-show-info">
          <div class="show-venue">${next.venue}</div>
          <div class="show-date">${formatDate(next.date)}</div>
          ${next.address ? `<div class="show-address"><a href="${mapsUrl}" target="_blank" rel="noopener">${next.address}</a></div>` : ''}
          ${next.phone  ? `<div class="show-address" style="margin-top:0.25rem">${next.phone}</div>` : ''}
          ${hasTime     ? `<div class="show-time">${next.time}</div>` : ''}
          ${dt          ? `<div class="countdown-timer" data-date="${dt}"></div>` : ''}
        </div>
        <div class="modal-actions">
          ${calUrl ? `<a href="${calUrl}" target="_blank" rel="noopener" class="btn btn-secondary">Add to Calendar</a>` : ''}
          <a href="shows.html" class="btn btn-primary">All Shows</a>
        </div>
      `;
    }

    case 'gallery': {
      const previews = [
        { src: 'images/gallery/AlmostFamous_May30-32.jpg', alt: 'Almost Famous GTA live' },
        { src: 'images/gallery/AlmostFamous_May30-38.jpg', alt: 'Almost Famous GTA on stage' },
        { src: 'images/gallery/IMG_1808.JPG',              alt: 'Almost Famous GTA 2015' },
        { src: 'images/gallery/1.jpg',                     alt: 'Almost Famous GTA 2014' },
      ];
      return `
        <h2>Gallery</h2>
        <div class="modal-gallery-grid">
          ${previews.map(p => `
            <div class="modal-gallery-item" onclick="window.location='gallery.html'" style="cursor:pointer">
              <img src="${p.src}" alt="${p.alt}" loading="lazy"
                   style="width:100%;height:100%;object-fit:cover;display:block;"
                   onerror="this.parentElement.style.background='linear-gradient(135deg,#1a1a2e,#0a0a0a)'"/>
            </div>`).join('')}
        </div>
        <a href="gallery.html" class="btn btn-primary" style="margin-top:1.5rem;display:inline-block">View Full Gallery</a>
      `;
    }

    case 'book':
      return `
        <h2>Book Almost Famous GTA</h2>
        <p>Looking for a high-energy cover band for your next event? We perform at corporate events, weddings, bar nights, festivals, and private parties.</p>
        <p>We customise our setlist to fit your event perfectly. Reach out to discuss availability and pricing.</p>
        <a href="mailto:almostfamousgta@gmail.com?subject=Booking%20Inquiry"
           class="btn btn-primary" style="margin-top:0.5rem">
          &#9993;&ensp;Email Us to Book
        </a>
      `;

    case 'contact':
      return `
        <h2>Get in Touch</h2>
        <p>Have a question or want to book us for your next event?</p>
        <p><a href="mailto:almostfamousgta@gmail.com">almostfamousgta@gmail.com</a></p>
        <p><a href="https://linktr.ee/almostfamousgta" target="_blank" rel="noopener">linktr.ee/almostfamousgta</a></p>
        <a href="mailto:almostfamousgta@gmail.com?subject=Booking%20Inquiry"
           class="btn btn-primary" style="margin-top:0.5rem">
          &#9993;&ensp;Book Us
        </a>
      `;

    default:
      return '<p>Content not available.</p>';
  }
}

// ── Next Show bar ─────────────────────────────────────────
function initNextShowBar() {
  const bar = document.getElementById('next-show-bar');
  if (!bar) return;

  const today = todayAtMidnight();
  const next = AF.gigs
    .filter(g => isUpcomingGig(g, today))
    .sort(sortGigsSoonestFirst)[0];
  if (!next) {
    bar.innerHTML = '<p class="no-shows" style="text-align:center;padding:1rem;color:var(--text-muted)">No upcoming shows right now. Check back soon!</p>';
    return;
  }

  const hasTime    = next.time && next.time.trim();
  const targetDate = hasTime ? new Date(`${next.date}T${parse12to24(next.time)}`) : new Date(`${next.date}T20:00:00`);
  const calUrl     = hasTime ? buildCalUrl(next) : '';

  bar.innerHTML = `
    <div class="next-show-content">
      <div class="next-show-label">NEXT SHOW</div>
      <div class="next-show-info">
        <span class="next-show-venue">${next.venue}</span>
        <span class="next-show-sep">·</span>
        <span class="next-show-date">${formatDate(next.date)}</span>
        ${hasTime ? `<span class="next-show-sep">·</span><span class="next-show-time">${next.time}</span>` : ''}
      </div>
      <div class="next-show-countdown" id="main-countdown"></div>
      <div class="next-show-actions">
        ${calUrl ? `<a href="${calUrl}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm">Add to Calendar</a>` : ''}
        <a href="shows.html" class="btn btn-primary btn-sm">ALL SHOWS</a>
      </div>
    </div>
  `;

  const el = document.getElementById('main-countdown');
  if (el) {
    const update = () => { el.textContent = formatCountdown(targetDate); };
    update();
    AF.countdownIntervals.push(setInterval(update, 1000));
  }
}

// ── Draggable bio photo ───────────────────────────────────
function initDraggablePhoto() {
  const photo   = document.getElementById('bio-photo');
  const section = document.getElementById('about-section');
  if (!photo || !section) return;

  if (window.innerWidth < 768) return; // mobile: static layout

  let dragging = false;
  let ox = 0, oy = 0;

  function onDown(cx, cy) {
    dragging = true;
    ox = cx - photo.offsetLeft;
    oy = cy - photo.offsetTop;
    photo.style.cursor = 'grabbing';
  }
  function onMove(cx, cy) {
    if (!dragging) return;
    const sw = section.offsetWidth;
    const sh = section.offsetHeight;
    const pw = photo.offsetWidth;
    const ph = photo.offsetHeight;
    const nx = Math.max(0, Math.min(cx - ox, sw - pw));
    const ny = Math.max(0, Math.min(cy - oy, sh - ph));
    photo.style.left = nx + 'px';
    photo.style.top  = ny + 'px';
    reflowBioText(nx, pw, sw, section);
  }
  function onUp() {
    dragging = false;
    photo.style.cursor = 'grab';
  }

  photo.addEventListener('mousedown', e => { onDown(e.clientX, e.clientY); e.preventDefault(); });
  document.addEventListener('mousemove', e => onMove(e.clientX, e.clientY));
  document.addEventListener('mouseup',   onUp);

  photo.addEventListener('touchstart', e => {
    const t = e.touches[0];
    onDown(t.clientX, t.clientY);
    e.preventDefault();
  }, { passive: false });
  document.addEventListener('touchmove', e => {
    if (!dragging) return;
    const t = e.touches[0];
    onMove(t.clientX, t.clientY);
  });
  document.addEventListener('touchend', onUp);
}

function reflowBioText(photoX, photoW, sectionW, section) {
  const wrapper = section.querySelector('.bio-text-wrapper');
  if (!wrapper) return;

  const isLeft = photoX < sectionW / 2;
  const gap    = 24;

  if (window.Pretext) {
    const bioEl  = wrapper.querySelector('.bio-text');
    const text   = bioEl ? bioEl.textContent : '';
    const style  = getComputedStyle(wrapper);
    const fs     = parseFloat(style.fontSize);
    const ff     = style.fontFamily;
    const lh     = parseFloat(style.lineHeight) || fs * 1.5;
    const availW = sectionW - photoW - gap * 2;

    const prep   = Pretext.prepare(text, { fontSize: fs, fontFamily: ff });
    // layout() is called purely arithmetically — no reflow
    Pretext.layout(prep, availW, lh);
  }

  // Apply margin so CSS text flows around photo
  if (isLeft) {
    wrapper.style.marginLeft  = (photoW + gap) + 'px';
    wrapper.style.marginRight = '0';
  } else {
    wrapper.style.marginLeft  = '0';
    wrapper.style.marginRight = (photoW + gap) + 'px';
  }
}

// ── Gallery preview (homepage) ────────────────────────────
function initGalleryPreview() {
  const grid = document.getElementById('gallery-preview-grid');
  if (!grid) return;

  const images = [
    { src: 'images/gallery/AlmostFamous_May30-32.jpg', year: '2018', alt: 'Almost Famous GTA live performance' },
    { src: 'images/gallery/AlmostFamous_May30-38.jpg', year: '2018', alt: 'Almost Famous GTA on stage' },
    { src: 'images/gallery/IMG_1808.JPG',              year: '2015', alt: 'Almost Famous GTA 2015' },
    { src: 'images/gallery/1.jpg',                     year: '2014', alt: 'Almost Famous GTA 2014' },
  ];
  AF.lightboxImages = images;

  images.forEach((img, i) => {
    const div = document.createElement('div');
    div.className = 'gallery-thumb';
    div.setAttribute('role', 'button');
    div.setAttribute('tabindex', '0');
    div.setAttribute('aria-label', img.alt);
    div.innerHTML = `
      <div class="gallery-thumb-inner" style="background:linear-gradient(135deg,hsl(${200+i*30},40%,10%),hsl(${260+i*20},30%,6%));">
        <img src="${img.src}" alt="${img.alt}" loading="lazy" onerror="this.style.display='none'"/>
        <span class="gallery-thumb-label">${img.year}</span>
        <div class="gallery-thumb-overlay"><span>View</span></div>
      </div>
    `;
    div.addEventListener('click',   () => openLightbox(i));
    div.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openLightbox(i); });
    grid.appendChild(div);
  });
}

// ── Lightbox ──────────────────────────────────────────────
function openLightbox(index) {
  AF.lightboxIndex = index;

  let lb = document.getElementById('lightbox');
  if (!lb) {
    lb = document.createElement('div');
    lb.id        = 'lightbox';
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.innerHTML = `
      <button class="lightbox-close" aria-label="Close">&times;</button>
      <button class="lightbox-prev"  aria-label="Previous">&#8592;</button>
      <button class="lightbox-next"  aria-label="Next">&#8594;</button>
      <div class="lightbox-content">
        <img id="lightbox-img" src="" alt="" />
        <div class="lightbox-caption" id="lightbox-caption"></div>
      </div>
    `;
    document.body.appendChild(lb);

    lb.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lb.querySelector('.lightbox-prev').addEventListener('click', () => navigateLightbox(-1));
    lb.querySelector('.lightbox-next').addEventListener('click', () => navigateLightbox(1));
    lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
  }

  renderLightboxSlide();
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
  lb.querySelector('.lightbox-close').focus();
}

function renderLightboxSlide() {
  const img  = AF.lightboxImages[AF.lightboxIndex];
  if (!img) return;
  const imgEl = document.getElementById('lightbox-img');
  const capEl = document.getElementById('lightbox-caption');

  if (imgEl) {
    imgEl.style.display = '';
    imgEl.src    = img.src;
    imgEl.alt    = img.alt;
    imgEl.onerror = function () {
      this.style.display = 'none';
      let ph = this.parentElement.querySelector('.lightbox-placeholder');
      if (!ph) {
        ph = document.createElement('div');
        ph.className = 'lightbox-placeholder';
        this.parentElement.insertBefore(ph, this);
      }
      ph.style.background = `linear-gradient(135deg,hsl(${AF.lightboxIndex*45},30%,12%),hsl(${AF.lightboxIndex*45+90},20%,8%))`;
      ph.textContent = img.alt;
    };
  }
  if (capEl) capEl.textContent = `${img.alt} · ${img.year}`;
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (lb) lb.classList.remove('active');
  document.body.style.overflow = '';
}

function navigateLightbox(dir) {
  AF.lightboxIndex = (AF.lightboxIndex + dir + AF.lightboxImages.length) % AF.lightboxImages.length;
  renderLightboxSlide();
}

// ── Shows page ────────────────────────────────────────────
async function initShowsPage() {
  const nextFeature = document.getElementById('next-show-feature');
  const nextCardEl  = document.getElementById('next-show-card');
  const upcomingEl = document.getElementById('upcoming-shows');
  const pastEl     = document.getElementById('past-shows');
  console.log('[AF] initShowsPage — upcomingEl:', !!upcomingEl, '| pastEl:', !!pastEl);

  if (!upcomingEl && !pastEl) return;

  if (!AF.gigs.length) await loadData();

  console.log('[AF] total gigs loaded:', AF.gigs.length);

  const today    = todayAtMidnight();
  const upcoming = AF.gigs
    .filter(g => isUpcomingGig(g, today))
    .sort(sortGigsSoonestFirst);
  const past     = AF.gigs
    .filter(g => !isUpcomingGig(g, today))
    .sort(sortGigsNewestFirst);

  console.log('[AF] upcoming:', upcoming.length, '| past:', past.length);

  if (nextFeature && nextCardEl) {
    if (!upcoming.length) {
      nextFeature.hidden = true;
      nextCardEl.innerHTML = '';
    } else {
      const nextCard = createUpcomingCard(upcoming[0]);
      nextCard.classList.add('featured');
      nextCardEl.innerHTML = '';
      nextCardEl.appendChild(nextCard);
      nextFeature.hidden = false;
    }
  }

  // ── Upcoming ──────────────────────────────────────────
  if (upcomingEl) {
    upcomingEl.innerHTML = '';
    if (!upcoming.length) {
      upcomingEl.innerHTML = '<p class="no-shows">No upcoming shows right now &mdash; check back soon!</p>';
    } else {
      upcoming.forEach(g => {
        try {
          upcomingEl.appendChild(createUpcomingCard(g));
        } catch (err) {
          console.error('[AF] createUpcomingCard failed for', g.date, err);
        }
      });
    }
  }

  // ── Past — grouped by year, descending ────────────────
  if (pastEl) {
    if (!past.length) {
      pastEl.innerHTML = '<p class="no-shows">No past performances on record yet.</p>';
    } else {
      // Group by year
      const byYear = {};
      past.forEach(g => {
        const yr = (g.date || '').slice(0, 4) || 'Unknown';
        (byYear[yr] = byYear[yr] || []).push(g);
      });
      const years = Object.keys(byYear).sort((a, b) => b - a);
      console.log('[AF] past years:', years, '| total past shows:', past.length);

      // Build as one HTML string — no risk of partial DOM writes
      pastEl.innerHTML = years.map(yr => `
        <div class="past-year-group">
          <h3 class="past-year-heading">${yr}</h3>
          <div class="past-shows-grid">
            ${byYear[yr].map(g => {
              const name = g.private ? 'Private Event' : (g.venue || 'TBA');
              return `
                <div class="show-card past">
                  <div class="show-card-inner past-card-inner">
                    <div class="show-date-badge">${formatDate(g.date)}</div>
                    <p class="show-venue past-venue">${name}</p>
                    <p class="show-city">${g.city || ''}</p>
                  </div>
                </div>`;
            }).join('')}
          </div>
        </div>`).join('');

      console.log('[AF] past shows rendered OK');
    }
  }

  startCountdownsForPage();
}

function createUpcomingCard(gig) {
  const card     = document.createElement('div');
  card.className = 'show-card upcoming';

  // Guard: if time is missing, skip calendar/countdown rather than throw
  const hasTime  = gig.time && gig.time.trim();
  const dt       = hasTime ? `${gig.date}T${parse12to24(gig.time)}` : '';
  const calUrl   = hasTime ? buildCalUrl(gig) : '';
  const mapsUrl  = gig.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(gig.address)}`
    : '';
  const mapEmbed = gig.address
    ? `https://maps.google.com/maps?q=${encodeURIComponent(gig.address)}&output=embed`
    : '';

  card.innerHTML = `
    <div class="show-card-inner">
      <div class="show-date-badge">${formatDate(gig.date)}</div>
      <h3 class="show-venue">${gig.venue}</h3>
      <p class="show-city">${gig.city}</p>
      ${gig.address ? `<p class="show-address"><a href="${mapsUrl}" target="_blank" rel="noopener">${gig.address}</a></p>` : ''}
      ${gig.phone   ? `<p class="show-phone">${gig.phone}</p>` : ''}
      ${hasTime     ? `<p class="show-time">&#9679;&ensp;${gig.time}</p>` : ''}
      ${dt          ? `<div class="show-countdown" data-date="${dt}"></div>` : ''}
      ${calUrl      ? `
      <div class="show-card-actions">
        <a href="${calUrl}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm">+ Add to Calendar</a>
      </div>` : ''}
      ${mapEmbed    ? `
      <div class="show-map">
        <iframe src="${mapEmbed}" width="100%" height="240" frameborder="0"
                style="border:0" allowfullscreen loading="lazy"
                title="Map of ${gig.venue}"></iframe>
      </div>` : ''}
    </div>
  `;
  return card;
}

function createPastCard(gig) {
  const card      = document.createElement('div');
  card.className  = 'show-card past';
  const venueName = gig.private ? 'Private Event' : (gig.venue || 'TBA');
  card.innerHTML  = `
    <div class="show-card-inner past-card-inner">
      <div class="show-date-badge">${formatDate(gig.date)}</div>
      <p class="show-venue past-venue">${venueName}</p>
      <p class="show-city">${gig.city || ''}</p>
    </div>
  `;
  return card;
}

function startCountdownsForPage() {
  document.querySelectorAll('.show-countdown[data-date]').forEach(el => {
    const target = new Date(el.dataset.date);
    const update = () => { el.textContent = formatCountdown(target); };
    update();
    AF.countdownIntervals.push(setInterval(update, 1000));
  });
}

// ── Gallery page ──────────────────────────────────────────
function initGalleryPage() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  const images = [
    // 2025
    { src: 'images/gallery/07c33cda81892271fcd9.jpg',                            year: '2025', alt: 'Almost Famous GTA 2025' },
    { src: 'images/gallery/80e1f6ce3c5f7df88472.jpg',                            year: '2025', alt: 'Almost Famous GTA 2025' },
    { src: 'images/gallery/83a0d986eaad2cec0e51.jpg',                            year: '2025', alt: 'Almost Famous GTA 2025' },
    { src: 'images/gallery/12728837_10156611567140038_1723462455570338100_n.jpg', year: '2025', alt: 'Almost Famous GTA 2025' },
    { src: 'images/gallery/a563bb4c5abef00e5617.jpg',                            year: '2025', alt: 'Almost Famous GTA 2025' },
    { src: 'images/gallery/aade6b4174d098e06d5b.jpg',                            year: '2025', alt: 'Almost Famous GTA 2025' },
    // 2018
    { src: 'images/gallery/AlmostFamous_May30-32.jpg',                           year: '2018', alt: 'Almost Famous GTA live 2018' },
    { src: 'images/gallery/AlmostFamous_May30-38.jpg',                           year: '2018', alt: 'Almost Famous GTA 2018' },
    // 2016
    { src: 'images/gallery/1d6ec72ea9706c94e3c9.jpg',  year: '2016', alt: 'Almost Famous GTA 2016' },
    { src: 'images/gallery/23600bc71d0c521ec79f.jpg',  year: '2016', alt: 'Almost Famous GTA 2016' },
    { src: 'images/gallery/3ac06e87a61abe81dfd6.jpg',  year: '2016', alt: 'Almost Famous GTA 2016' },
    { src: 'images/gallery/3c234e6f2b824c1d51a2.jpg',  year: '2016', alt: 'Almost Famous GTA 2016' },
    { src: 'images/gallery/3c9e4136fa2c09cd0c6d.jpg',  year: '2016', alt: 'Almost Famous GTA 2016' },
    { src: 'images/gallery/3ce920a449340c2184b0.jpg',  year: '2016', alt: 'Almost Famous GTA 2016' },
    { src: 'images/gallery/732bca635330d281da7d.jpg',  year: '2016', alt: 'Almost Famous GTA 2016' },
    { src: 'images/gallery/8443be794b7f0db7b9a9.jpg',  year: '2016', alt: 'Almost Famous GTA 2016' },
    { src: 'images/gallery/8abea0f07ffe315e4415.jpg',  year: '2016', alt: 'Almost Famous GTA 2016' },
    { src: 'images/gallery/93ad818cf1d544156f3c.jpg',  year: '2016', alt: 'Almost Famous GTA 2016' },
    { src: 'images/gallery/997fbdf7c79a67b1ff0f.jpg',  year: '2016', alt: 'Almost Famous GTA 2016' },
    { src: 'images/gallery/adf81d433d4f97b7d55c.jpg',  year: '2016', alt: 'Almost Famous GTA 2016' },
    { src: 'images/gallery/e141c609071368aeaeb4.jpg',  year: '2016', alt: 'Almost Famous GTA 2016' },
    { src: 'images/gallery/IMG_2167.jpg',               year: '2016', alt: 'Almost Famous GTA 2016' },
    { src: 'images/gallery/IMG_6588.JPG',               year: '2016', alt: 'Almost Famous GTA 2016' },
    { src: 'images/gallery/IMG_7250.JPG',               year: '2016', alt: 'Almost Famous GTA 2016' },
    { src: 'images/gallery/IMG_8018.JPG',               year: '2016', alt: 'Almost Famous GTA 2016' },
    // 2015
    { src: 'images/gallery/Schwaben 2015_IMG_1879.jpg', year: '2015', alt: 'Almost Famous GTA at Schwaben Club 2015' },
    { src: 'images/gallery/IMG_1808.JPG',               year: '2015', alt: 'Almost Famous GTA 2015' },
    { src: 'images/gallery/IMG_6748.JPG',               year: '2015', alt: 'Almost Famous GTA 2015' },
    { src: 'images/gallery/IMG_6847.JPG',               year: '2015', alt: 'Almost Famous GTA 2015' },
    { src: 'images/gallery/IMG_7510.JPG',               year: '2015', alt: 'Almost Famous GTA 2015' },
    // 2014
    { src: 'images/gallery/1.jpg',                      year: '2014', alt: 'Almost Famous GTA 2014' },
    { src: 'images/gallery/4.jpg',                      year: '2014', alt: 'Almost Famous GTA 2014' },
    { src: 'images/gallery/5.jpg',                      year: '2014', alt: 'Almost Famous GTA 2014' },
    { src: 'images/gallery/IMG_2873 - Copy.JPG',        year: '2014', alt: 'Almost Famous GTA 2014' },
    { src: 'images/gallery/IMG_2881.JPG',               year: '2014', alt: 'Almost Famous GTA 2014' },
  ];
  AF.lightboxImages = images;

  function render(filter) {
    grid.innerHTML = '';
    const list = filter === 'all' ? images : images.filter(i => i.year === filter);
    list.forEach((img) => {
      const origIdx = images.indexOf(img);
      const item = document.createElement('div');
      item.className = 'gallery-item';
      item.dataset.year = img.year;
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');
      item.setAttribute('aria-label', img.alt);
      item.innerHTML = `
        <div class="gallery-item-inner" style="background:linear-gradient(135deg,hsl(${origIdx*36},30%,10%),hsl(${origIdx*36+90},20%,6%));">
          <img src="${img.src}" alt="${img.alt}" loading="lazy" onerror="this.style.display='none'"/>
          <div class="gallery-item-overlay">
            <span class="gallery-year-tag">${img.year}</span>
          </div>
        </div>
      `;
      item.addEventListener('click',   () => openLightbox(origIdx));
      item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openLightbox(origIdx); });
      grid.appendChild(item);
    });
  }

  // Year filter buttons
  document.querySelectorAll('.gallery-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.gallery-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      render(btn.dataset.year);
    });
  });

  render('all');
}

// ── Keyboard nav (global for lightbox) ───────────────────
function initKeyboard() {
  document.addEventListener('keydown', e => {
    const lb = document.getElementById('lightbox');
    if (lb && lb.classList.contains('active')) {
      if (e.key === 'ArrowLeft')  navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
      if (e.key === 'Escape')     closeLightbox();
    }
    if (e.key === 'Escape') closeStageModal();
  });
}

// ── Artist marquee border (clockwise around hero image) ───
function initStageMarquee() {
  const container = document.querySelector('.hotspot-container');
  if (!container) return;

  // Trailing spaces give a visible gap between the looped copies
  const TEXT = 'Depeche Mode \u00b7 Jimmy Eat World \u00b7 Blur \u00b7 The Cult \u00b7 Tommy Tutone \u00b7 The Killers \u00b7 The Tragically Hip \u00b7 A Flock of Seagulls \u00b7 Simple Minds \u00b7 The Beatles \u00b7 George Michael \u00b7 Gary Numan \u00b7 Bruno Mars \u00b7 The Cure \u00b7 David Bowie \u00b7 The Clash \u00b7 Billy Idol \u00b7 Pet Shop Boys \u00b7 The Escape Club \u00b7 Alannah Myles \u00b7 Wild Cherry \u00b7 Erasure \u00b7 Santana \u00b7 The Charlatans \u00b7 The Fixx \u00b7 Soft Cell \u00b7 Dead Or Alive \u00b7 Amy Winehouse \u00b7 House Of Pain \u00b7 Steppenwolf \u00b7 Elvis Costello \u00b7 The Black Crowes \u00b7 The Proclaimers \u00b7 Neil Diamond \u00b7 B-52s \u00b7 Young MC \u00b7 Pat Benatar \u00a0\u00a0\u00a0\u00a0';
  const STRIP_H = 20;  // px — must match CSS
  const SPEED   = 50;  // px/s

  // Build one strip: wrap > inner > track × 2
  function buildStrip(side) {
    const wrap  = document.createElement('div');
    wrap.className = `stage-marquee stage-marquee--${side}`;
    const inner = document.createElement('div');
    inner.className = 'stage-marquee-inner';
    for (let i = 0; i < 2; i++) {
      const track = document.createElement('div');
      track.className = 'stage-marquee-track';
      track.textContent = TEXT;
      inner.appendChild(track);
    }
    wrap.appendChild(inner);
    container.appendChild(wrap);
    return inner;
  }

  const topInner    = buildStrip('top');
  const rightInner  = buildStrip('right');
  const bottomInner = buildStrip('bottom');
  const leftInner   = buildStrip('left');

  // Star lives in the right end of the solid top bar — never overlaps the hero image
  const star = document.createElement('a');
  star.className = 'stage-marquee-star';
  star.href = 'index.html';
  star.setAttribute('aria-label', 'Almost Famous GTA — Home');
  star.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="currentColor"/></svg>';
  topInner.parentElement.appendChild(star);

  // Measure and animate after layout
  requestAnimationFrame(() => {
    // Horizontal text length — use Pretext for precision, fall back to DOM
    let hLen;
    if (window.Pretext) {
      const style = getComputedStyle(topInner.firstChild);
      const fs    = parseFloat(style.fontSize);
      const ff    = style.fontFamily;
      const prep  = Pretext.prepare(TEXT, { fontSize: fs, fontFamily: ff });
      let w = 0;
      Pretext.walkLineRanges(prep, 999999, fs * 1.5, (s, e, lw) => { w = Math.max(w, lw); });
      hLen = Math.ceil(w) + 12; // +12 for track padding (6px each side)
    } else {
      hLen = topInner.firstChild.offsetWidth;
    }

    // Size the vertical-strip inners so they span the strip's full height.
    // The inner is a horizontal flex bar that gets rotated 90°; its width
    // must equal the parent strip's clientHeight so after rotation it fills
    // the strip top-to-bottom.
    [rightInner, leftInner].forEach(inner => {
      const strip = inner.parentElement;
      const h     = strip.clientHeight;          // height of the vertical strip
      const half  = h / 2;
      // Centre the bar in the strip, then rotate around its own centre.
      // rotate(90deg) on the right inner  → +X becomes downward → smq-right = downward ✓
      // rotate(-90deg) on the left inner  → +X becomes upward   → smq-right = upward  ✓
      inner.style.width       = h + 'px';
      inner.style.top         = half + 'px';
      inner.style.left        = half + 'px';
      inner.style.marginTop   = -(STRIP_H / 2) + 'px';
      inner.style.marginLeft  = -half + 'px';
    });

    const dur = hLen / SPEED;

    // Top  → text travels right  (enter from left,  exit right)
    topInner.style.animation    = `smq-right ${dur}s linear infinite`;
    // Right → rotate(90deg) parent; smq-right on child → downward in page
    rightInner.style.animation  = `smq-right ${dur}s linear infinite`;
    // Bottom → text travels left  (enter from right, exit left)
    bottomInner.style.animation = `smq-left  ${dur}s linear infinite`;
    // Left  → rotate(-90deg) parent; smq-right on child → upward in page
    leftInner.style.animation   = `smq-right ${dur}s linear infinite`;
  });
}

// ── Scroll fade-in ────────────────────────────────────────
function initScrollFade() {
  const els = document.querySelectorAll('.fade-in');
  if (!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
}

// ── Main init ─────────────────────────────────────────────
async function init() {
  await loadData();

  initNav();
  initKeyboard();
  initScrollFade();

  const page = document.body.dataset.page || 'home';

  if (page === 'home') {
    initStage();
    initTaglineScatter();
    initStageMarquee();
    initNextShowBar();
    initDraggablePhoto();
    initGalleryPreview();
  } else if (page === 'shows') {
    await initShowsPage();
  } else if (page === 'gallery') {
    initGalleryPage();
  }
}

document.addEventListener('DOMContentLoaded', init);
