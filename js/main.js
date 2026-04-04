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
  {
    id: 1,
    date: '2026-04-17',
    venue: 'Royal Canadian Legion Branch 101',
    city: 'Etobicoke, ON',
    address: '3850 Lake Shore Blvd W, Etobicoke, ON M8W 1R3',
    phone: '',
    time: '7:00 PM',
    image: 'images/show1.jpg',
    upcoming: true,
  },
  {
    id: 2,
    date: '2026-02-06',
    venue: "Cuchulainn's Irish Pub",
    city: 'Streetsville, ON',
    address: 'Streetsville, Mississauga, ON',
    phone: '',
    time: '8:00 PM',
    image: 'images/show2.jpg',
    upcoming: false,
  },
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
  try {
    const [gigsRes, artistsRes] = await Promise.all([
      fetch('data/gigs.json'),
      fetch('data/artists.json'),
    ]);
    if (!gigsRes.ok || !artistsRes.ok) throw new Error('HTTP error');
    AF.gigs    = await gigsRes.json();
    AF.artists = await artistsRes.json();
  } catch (_) {
    AF.gigs    = FALLBACK_GIGS;
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

// ── Stage modal system ────────────────────────────────────
function initStage() {
  const overlay = document.getElementById('stage-modal-overlay');
  if (!overlay) return;

  // SVG prop click handlers
  document.querySelectorAll('.stage-prop[data-modal]').forEach(el => {
    el.addEventListener('click', () => openStageModal(el.dataset.modal));
  });

  // Mobile row buttons
  document.querySelectorAll('.stage-mobile-btn[data-modal]').forEach(el => {
    el.addEventListener('click', () => openStageModal(el.dataset.modal));
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
        <p>Almost Famous GTA is Toronto's premier cover band, delivering electrifying performances spanning rock, dance, pop, and the greatest hits of the 80s, 90s, and 00s. With a massive repertoire and serious stage presence, we bring the energy of your favourite artists to every venue we play.</p>
        <p>From intimate pubs to large events, Almost Famous GTA keeps audiences dancing all night long.</p>
        <a href="mailto:almostfamousgta@gmail.com?subject=Booking%20Inquiry" class="btn btn-primary" style="margin-top:0.5rem">Contact Us</a>
      `;

    case 'shows': {
      const next = AF.gigs.find(g => g.upcoming);
      if (!next) return '<h2>Upcoming Shows</h2><p>No upcoming shows at this time. Check back soon!</p>';
      const dt      = `${next.date}T${parse12to24(next.time)}`;
      const calUrl  = buildCalUrl(next);
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(next.address)}`;
      return `
        <h2>Next Show</h2>
        <div class="modal-show-info">
          <div class="show-venue">${next.venue}</div>
          <div class="show-date">${formatDate(next.date)}</div>
          <div class="show-address"><a href="${mapsUrl}" target="_blank" rel="noopener">${next.address}</a></div>
          <div class="show-time">${next.time}</div>
          <div class="countdown-timer" data-date="${dt}"></div>
        </div>
        <div class="modal-actions">
          <a href="${calUrl}" target="_blank" rel="noopener" class="btn btn-secondary">Add to Calendar</a>
          <a href="shows.html" class="btn btn-primary">All Shows</a>
        </div>
      `;
    }

    case 'gallery':
      return `
        <h2>Gallery</h2>
        <div class="modal-gallery-grid">
          ${[1,2,3,4].map(n => `
            <div class="modal-gallery-item" onclick="window.location='gallery.html'">
              <div class="gallery-placeholder" style="background:linear-gradient(135deg,#1a1a2e ${n*18}%,#2a1020 ${n*18+40}%,#0a0a0a);">
                <span style="font-size:2rem;opacity:.3">${n}</span>
              </div>
            </div>`).join('')}
        </div>
        <a href="gallery.html" class="btn btn-primary" style="margin-top:1.5rem;display:inline-block">View Full Gallery</a>
      `;

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

    default:
      return '<p>Content not available.</p>';
  }
}

// ── Next Show bar ─────────────────────────────────────────
function initNextShowBar() {
  const bar = document.getElementById('next-show-bar');
  if (!bar) return;

  const next = AF.gigs.find(g => g.upcoming);
  if (!next) {
    bar.innerHTML = '<p class="no-shows" style="text-align:center;padding:1rem;color:var(--text-muted)">No upcoming shows right now. Check back soon!</p>';
    return;
  }

  const targetDate = new Date(`${next.date}T${parse12to24(next.time)}`);
  const calUrl     = buildCalUrl(next);

  bar.innerHTML = `
    <div class="next-show-content">
      <div class="next-show-label">NEXT SHOW</div>
      <div class="next-show-info">
        <span class="next-show-venue">${next.venue}</span>
        <span class="next-show-sep">·</span>
        <span class="next-show-date">${formatDate(next.date)}</span>
        <span class="next-show-sep">·</span>
        <span class="next-show-time">${next.time}</span>
      </div>
      <div class="next-show-countdown" id="main-countdown"></div>
      <div class="next-show-actions">
        <a href="${calUrl}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm">Add to Calendar</a>
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
    { src: 'images/gallery/1.jpg', year: '2024', alt: 'Almost Famous GTA performing live' },
    { src: 'images/gallery/2.jpg', year: '2024', alt: 'Band on stage' },
    { src: 'images/gallery/3.jpg', year: '2025', alt: 'Live performance' },
    { src: 'images/gallery/4.jpg', year: '2025', alt: 'Crowd at the show' },
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
  const upcomingEl = document.getElementById('upcoming-shows');
  const recentEl   = document.getElementById('recent-shows');
  if (!upcomingEl && !recentEl) return;

  if (!AF.gigs.length) await loadData();

  const upcoming = AF.gigs.filter(g => g.upcoming);
  const past     = AF.gigs.filter(g => !g.upcoming);

  if (upcomingEl) {
    if (!upcoming.length) {
      upcomingEl.innerHTML = '<p class="no-shows">No upcoming shows right now. Check back soon!</p>';
    } else {
      upcoming.forEach(g => upcomingEl.appendChild(createShowCard(g, true)));
      // Shrinkwrap after paint
      requestAnimationFrame(() => shrinkwrapCards(upcomingEl));
    }
  }

  if (recentEl) {
    if (!past.length) {
      recentEl.innerHTML = '<p class="no-shows">No past performances on record yet.</p>';
    } else {
      past.forEach(g => recentEl.appendChild(createShowCard(g, false)));
      requestAnimationFrame(() => shrinkwrapCards(recentEl));
    }
  }

  startCountdownsForPage();
}

function createShowCard(gig, isUpcoming) {
  const card = document.createElement('div');
  card.className = `show-card ${isUpcoming ? 'upcoming' : 'past'}`;

  const calUrl  = buildCalUrl(gig);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(gig.address)}`;
  const mapEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(gig.address)}&output=embed`;
  const dt      = `${gig.date}T${parse12to24(gig.time)}`;

  card.innerHTML = `
    <div class="show-card-inner">
      <div class="show-date-badge">${formatDate(gig.date)}</div>
      <h3 class="show-venue">${gig.venue}</h3>
      <p class="show-city">${gig.city}</p>
      <p class="show-address">
        <a href="${mapsUrl}" target="_blank" rel="noopener">${gig.address}</a>
      </p>
      <p class="show-time">Doors: ${gig.time}</p>
      ${isUpcoming ? `<div class="show-countdown" data-date="${dt}"></div>` : ''}
      ${isUpcoming ? `
        <div class="show-card-actions">
          <a href="${calUrl}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm">Add to Calendar</a>
        </div>
        <div class="show-map">
          <iframe src="${mapEmbed}" width="100%" height="220" frameborder="0"
                  style="border:0" allowfullscreen loading="lazy"
                  title="Map of ${gig.venue}"></iframe>
        </div>` : ''}
    </div>
  `;
  return card;
}

function shrinkwrapCards(container) {
  if (!window.Pretext) return;
  container.querySelectorAll('.show-card-inner').forEach(card => {
    const venueEl = card.querySelector('.show-venue');
    if (!venueEl) return;
    const style  = getComputedStyle(venueEl);
    const fs     = parseFloat(style.fontSize);
    const ff     = style.fontFamily;
    const fw     = style.fontWeight;
    const prep   = Pretext.prepare(venueEl.textContent, { fontSize: fs, fontFamily: ff, fontWeight: fw });

    let maxW = 0;
    // walkLineRanges lets us find the natural single-line width
    Pretext.walkLineRanges(prep, 9999, fs * 1.4, (s, e, lw) => { maxW = Math.max(maxW, lw); });

    if (maxW > 0) {
      // Add padding + a bit of breathing room
      const minPx = Math.ceil(maxW) + 64;
      card.style.minWidth = minPx + 'px';
    }
  });
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
    { src: 'images/gallery/1.jpg',  year: '2025', alt: 'Almost Famous GTA — live 2025' },
    { src: 'images/gallery/2.jpg',  year: '2025', alt: 'On stage performance 2025' },
    { src: 'images/gallery/3.jpg',  year: '2024', alt: 'Band photo 2024' },
    { src: 'images/gallery/4.jpg',  year: '2024', alt: 'Crowd at show 2024' },
    { src: 'images/gallery/5.jpg',  year: '2018', alt: 'Early performance 2018' },
    { src: 'images/gallery/6.jpg',  year: '2018', alt: 'Backstage 2018' },
    { src: 'images/gallery/7.jpg',  year: '2017', alt: 'First show 2017' },
    { src: 'images/gallery/8.jpg',  year: '2017', alt: 'Rehearsal 2017' },
    { src: 'images/gallery/9.jpg',  year: '2024', alt: 'Sound check 2024' },
    { src: 'images/gallery/10.jpg', year: '2025', alt: 'New Years show 2025' },
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
    initHeroAnimation();
    initTicker();
    initStage();
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
