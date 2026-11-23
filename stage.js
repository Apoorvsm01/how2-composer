// The stage: builds the scene once, then turns each beat in beats.js into a state and shows it.
// Layout and motion live in styles.css; this file only sets data attributes, types the prompt,
// places the thoughts and listens to keys, clicks and swipes.

(function () {
  'use strict';

  var W = 1920, H = 1080;
  var viewport = document.getElementById('viewport');
  var stage = document.getElementById('stage');
  var hud = document.getElementById('hud');
  var count = document.getElementById('count');
  var overview = document.getElementById('overview');
  var css = getComputedStyle(document.documentElement);
  var TYPE_MS = parseFloat(css.getPropertyValue('--type-ms')) || 0;

  // ---------- icons: 24 x 24, stroked ----------
  function icon(body, fill) {
    return '<svg viewBox="0 0 24 24" fill="' + (fill ? 'currentColor' : 'none') + '" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + body + '</svg>';
  }
  var I = {
    close: icon('<path d="M6 6l12 12M18 6L6 18"/>'),
    back10: icon('<path d="M4.5 9A8 8 0 1 1 4 12"/><path d="M4.5 4.5V9H9"/><text x="12" y="15.6" font-size="7.5" font-weight="700" text-anchor="middle" fill="currentColor" stroke="none" font-family="system-ui">10</text>'),
    fwd10: icon('<path d="M19.5 9A8 8 0 1 0 20 12"/><path d="M19.5 4.5V9H15"/><text x="12" y="15.6" font-size="7.5" font-weight="700" text-anchor="middle" fill="currentColor" stroke="none" font-family="system-ui">10</text>'),
    pause: icon('<rect x="6.5" y="5" width="3.6" height="14" rx="1.2"/><rect x="13.9" y="5" width="3.6" height="14" rx="1.2"/>', true),
    volume: icon('<path d="M4 9.5h3l4.5-4v13L7 14.5H4z"/><path d="M15 9a4 4 0 0 1 0 6M17.8 6.5a7.5 7.5 0 0 1 0 11"/>'),
    shrink: icon('<path d="M14 4v6h6M10 20v-6H4M14 10l6-6M10 14l-6 6"/>'),
    expand: icon('<path d="M14 4h6v6M10 20H4v-6M20 4l-6 6M4 20l6-6"/>'),
    steps: icon('<rect x="5" y="3.5" width="14" height="17" rx="2.5"/><path d="M8.5 8h7M8.5 12h7M8.5 16h4"/>'),
    grid: icon('<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>'),
    whisk: icon('<path d="M4 20l7-7"/><path d="M11 13c-1-3 1.5-8.5 5-9.5 1.5 3-1 7.5-5 9.5z"/><path d="M11 13c3 1 8.5-1.5 9.5-5-3-1.5-7.5 1-9.5 5z"/>'),
    sources: icon('<path d="M5 4.5v15M9.5 4.5v15"/><path d="M13.5 5.2l4.2-1.2 3 15.3-4.2 1.2z"/>')
  };

  // ---------- build the scene once ----------
  stage.innerHTML =
    '<div class="world" id="world">' +
      '<div class="room"><img class="room-photo" src="assets/kitchen-toast.jpg" alt=""></div>' +

      // act 1
      '<div class="glass part phone"><div class="phone-screen"><img src="assets/kitchen-toast.jpg" alt="">' +
        '<div class="phone-label"><span class="early">Step 2 · Whisk the eggs</span><span class="late">Step 5 · Flip the toast</span></div>' +
        '<div class="phone-bar"><i></i></div></div></div>' +
      '<div class="glass part laptop"><div class="laptop-dots"><i></i><i></i><i></i></div><h3>Classic French Toast</h3>' +
        '<div class="laptop-body"><div class="lines"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>' +
        '<img src="assets/toast.png" alt=""></div></div>' +
      '<div class="part recipe"><h4>French toast</h4><p>Serves 2 · page 2 of 4</p><div class="lines">' +
        '<i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div>' +

      // act 4
      '<div class="glass part hero"><img src="assets/kitchen-toast.jpg" alt="French toast on a plate"></div>' +
      '<div class="glass part step"><h4>Step 1</h4><p>Whisk 2 eggs, ½ cup of milk and a pinch of <em>cinnamon</em> in a shallow dish.</p></div>' +
      '<div class="glass part ingredients"><h5>Ingredients you need</h5><div class="ing-row" id="ing-row"></div></div>' +
      '<div class="part sources">' +
        source('logo-wikihow.png', 'WikiHow', 'Step by step') +
        source('logo-youtube.png', 'YouTube', 'Fluffy toast') +
        source('logo-a.png', 'Recipes', 'The classic') + '</div>' +
      '<div class="glass part app timer"><h5>Timer</h5><strong>04:32</strong></div>' +
      '<div class="glass part app notes"><h5>Notes · Shopping</h5><ul><li>Brioche</li><li>Maple syrup</li><li>Butter</li><li>Berries</li></ul></div>' +
      '<div class="glass part app music"><i></i><span><strong>Sunday Morning</strong>Playlist · 24 songs</span></div>' +

      // the end
      '<div class="part plate"><img src="assets/toast.png" alt=""></div>' +

      // the composer
      '<div class="composer" id="composer" data-mode="hidden">' +
        '<div class="c-listen"></div>' +
        '<div class="c-orb"><img class="orb-idle" src="assets/orb.png" alt=""><img class="orb-listen" src="assets/orb-listen.png" alt=""></div>' +
        '<div class="c-text"><span class="c-how">How to</span><span class="c-rest" id="c-rest"></span><span class="c-caret"></span></div>' +
      '</div>' +

      // media control: three variants in one box
      '<div class="media" id="media" data-variant="none"><div class="glass media-box" style="position:relative">' +
        '<div class="mv mv-basic"><div class="m-row">' +
          plain(I.close) + plain(I.back10) + plain(I.pause) + plain(I.fwd10) +
          '<div class="m-slider" style="width:260px"><i></i></div>' + plain(I.volume) + plain(I.shrink) +
        '</div></div>' +
        '<div class="mv mv-full">' +
          '<div class="m-top" data-k="steps"><div class="m-slider"><i style="width:22%"></i></div><span class="m-next">Next</span></div>' +
          '<div class="m-row">' +
            '<span class="m-btn close">' + I.close + '</span>' +
            btn('steps', I.steps) + btn('tutorials', I.grid) +
            '<div class="m-play">' + plain(I.back10) + plain(I.pause) + plain(I.fwd10) + '</div>' +
            btn('viewer', I.expand) + btn('ingredients', I.whisk) + btn('sources', I.sources) +
          '</div></div>' +
        '<div class="mv mv-minimal"><div class="m-row">' +
          plain(I.close) + plain(I.back10) + plain(I.pause) + plain(I.fwd10) + plain(I.expand) +
        '</div></div>' +
      '</div></div>' +

      '<div class="thoughts" id="thoughts"></div>' +
    '</div>';

  function source(logo, name, title) {
    return '<div class="source"><img src="assets/' + logo + '" alt=""><span><strong>' + name + '</strong>' + title + '</span></div>';
  }
  function plain(svg) { return '<span class="m-plain">' + svg + '</span>'; }
  function btn(k, svg) { return '<span class="m-btn" data-k="' + k + '">' + svg + '</span>'; }

  var INGREDIENTS = ['bread', 'eggs', 'cinnamon', 'pan', 'skillet'];
  var ingRow = document.getElementById('ing-row');
  ingRow.innerHTML = INGREDIENTS.map(function (n) {
    return '<div class="ing" data-status="-"><img src="assets/ing-' + n + '.png" alt="' + n + '"><b></b></div>';
  }).join('');
  var ings = ingRow.children;

  var world = document.getElementById('world');
  var composer = document.getElementById('composer');
  var cRest = document.getElementById('c-rest');
  var media = document.getElementById('media');
  var thoughtsEl = document.getElementById('thoughts');
  var parts = stage.querySelectorAll('.part');

  // ---------- state ----------
  var START = { scene: 'title', composer: 'hidden', text: '', phone: 'on', checks: '- - - - -',
    look: '', media: 'none', focus: '' };

  function stateAt(i) {
    var s = {}, k;
    for (k in START) s[k] = START[k];
    for (var b = 0; b <= i; b++) {
      var set = BEATS[b].set || {};
      for (k in set) s[k] = set[k];
    }
    s.thoughts = BEATS[i].thoughts || [];
    return s;
  }

  // ---------- draw one state ----------
  var current = -1, typing = null, slots = {};

  function show(i, instant) {
    i = Math.max(0, Math.min(BEATS.length - 1, i));
    var forward = i === current + 1;
    var prev = current >= 0 ? stateAt(current) : null;
    var s = stateAt(i);
    current = i;

    if (instant) stage.classList.add('no-anim');

    stage.dataset.scene = s.scene;
    stage.dataset.phone = s.phone;
    stage.dataset.look = s.look;
    composer.dataset.mode = s.composer;

    // which parts are on is decided by CSS per scene; clear any leftover inline state
    for (var p = 0; p < parts.length; p++) parts[p].classList.remove('on');

    // the prompt: typed in when it grows on a forward press, set at once otherwise
    clearInterval(typing); composer.classList.remove('typing');
    var rest = s.text ? ' ' + s.text : (s.composer === 'listening' ? ' …' : ' … anything!');
    var was = prev && prev.text ? ' ' + prev.text : '';
    if (!instant && forward && TYPE_MS && s.text && rest.indexOf(was) === 0 && rest.length > was.length) {
      var n = was.length;
      cRest.textContent = was;
      composer.classList.add('typing');
      typing = setInterval(function () {
        n++;
        cRest.textContent = rest.slice(0, n);
        if (n >= rest.length) { clearInterval(typing); composer.classList.remove('typing'); }
      }, TYPE_MS);
    } else {
      cRest.textContent = rest;
    }

    // ingredients
    var checks = s.checks.split(' ');
    for (var c = 0; c < ings.length; c++) {
      var status = checks[c] || '-';
      ings[c].dataset.status = status;
      ings[c].querySelector('b').textContent = status === 'ok' ? '✓' : status === 'miss' ? '!' : '';
      // tick them one after another on a forward press
      ings[c].querySelector('b').style.transitionDelay = (!instant && forward) ? (c * 140) + 'ms' : '0ms';
    }

    // media
    media.dataset.variant = s.media;
    media.classList.toggle('has-focus', !!s.focus && s.media === 'full');
    var ks = media.querySelectorAll('[data-k]');
    for (var m = 0; m < ks.length; m++) ks[m].classList.toggle('is-focus', ks[m].dataset.k === s.focus);

    drawThoughts(s.thoughts, instant);

    count.textContent = (i + 1) + ' / ' + BEATS.length;
    try { history.replaceState(null, '', '#' + (i + 1)); } catch (e) { /* file:// */ }
    markOverview();

    if (instant) { void stage.offsetWidth; requestAnimationFrame(function () { stage.classList.remove('no-anim'); }); }
  }

  // Thoughts are keyed by place and words: one that stays on the next press is left alone.
  function drawThoughts(list, instant) {
    var wanted = {};
    list.forEach(function (t, n) {
      var at = t.at || 'bottom';
      var key = at + '|' + (t.size || '') + '|' + t.text;
      wanted[key] = { t: t, at: at, n: n };
    });
    // remove what is no longer wanted
    Array.prototype.forEach.call(thoughtsEl.querySelectorAll('.thought:not(.out)'), function (el) {
      if (!wanted[el.dataset.key]) {
        if (instant) { el.remove(); return; }
        el.classList.add('out');
        setTimeout(function () { el.remove(); }, 380);
      }
    });
    // add what is new, in order
    var fresh = 0;
    list.forEach(function (t) {
      var at = t.at || 'bottom';
      var key = at + '|' + (t.size || '') + '|' + t.text;
      var slot = slotFor(at);
      if (slot.querySelector('.thought[data-key="' + cssEscape(key) + '"]:not(.out)')) return;
      var el = document.createElement('p');
      el.className = 'thought' + (t.size ? ' ' + t.size : '');
      el.dataset.key = key;
      el.innerHTML = format(t.text);
      el.style.animationDelay = instant ? '0ms' : (220 + fresh * 160) + 'ms';
      if (instant) el.style.animation = 'none';
      fresh++;
      slot.appendChild(el);
    });
  }
  function slotFor(at) {
    if (!slots[at]) {
      slots[at] = document.createElement('div');
      slots[at].className = 'slot slot-' + at;
      thoughtsEl.appendChild(slots[at]);
    }
    return slots[at];
  }
  function format(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  }
  function cssEscape(s) { return window.CSS && CSS.escape ? CSS.escape(s) : s.replace(/["\\]/g, '\\$&'); }

  // ---------- fit the stage to the window ----------
  function fit() {
    var w = window.innerWidth, h = window.innerHeight;
    var k = Math.min(w / W, h / H);
    stage.style.transform = 'translate(' + (w - W * k) / 2 + 'px,' + (h - H * k) / 2 + 'px) scale(' + k + ')';
  }
  window.addEventListener('resize', fit);
  fit();

  // ---------- a little depth: the room tilts with the pointer ----------
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!still) {
    viewport.addEventListener('pointermove', function (e) {
      var x = e.clientX / window.innerWidth - 0.5, y = e.clientY / window.innerHeight - 0.5;
      world.style.setProperty('--tilt-y', (x * 3).toFixed(2) + 'deg');
      world.style.setProperty('--tilt-x', (-y * 2).toFixed(2) + 'deg');
    });
  }

  // ---------- moving through the talk ----------
  function next() { if (current < BEATS.length - 1) show(current + 1); }
  function back() { if (current > 0) show(current - 1); }
  function restart() { current = -1; show(0, true); }

  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (!overview.hidden) {
      if (key === 'Escape' || key === 'o') { e.preventDefault(); toggleOverview(false); }
      return;
    }
    if (key === 'ArrowRight' || key === 'ArrowDown' || key === ' ' || key === 'PageDown' || key === 'Enter') { e.preventDefault(); next(); }
    else if (key === 'ArrowLeft' || key === 'ArrowUp' || key === 'PageUp' || key === 'Backspace') { e.preventDefault(); back(); }
    else if (key === 'Home' || key === 'r') { e.preventDefault(); restart(); }
    else if (key === 'End') { e.preventDefault(); show(BEATS.length - 1, true); }
    else if (key === 'o') { e.preventDefault(); toggleOverview(true); }
    else if (key === 'f') { e.preventDefault(); fullScreen(); }
    else return;
    flashHud();
  });

  // a click on the left fifth goes back, anywhere else goes on
  viewport.addEventListener('click', function (e) {
    if (e.clientX < window.innerWidth * 0.2) back(); else next();
    flashHud();
  });

  // swipes on touch screens
  var touchX = null;
  viewport.addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; }, { passive: true });
  viewport.addEventListener('touchend', function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(dx) > 40) { e.preventDefault(); dx < 0 ? next() : back(); flashHud(); }
  });

  document.getElementById('prev').addEventListener('click', function (e) { e.stopPropagation(); back(); });
  document.getElementById('next').addEventListener('click', function (e) { e.stopPropagation(); next(); });
  document.getElementById('all').addEventListener('click', function (e) { e.stopPropagation(); toggleOverview(true); });

  var hudTimer;
  function flashHud() {
    hud.classList.add('show');
    clearTimeout(hudTimer);
    hudTimer = setTimeout(function () { hud.classList.remove('show'); }, 1800);
  }
  document.addEventListener('mousemove', flashHud);

  function fullScreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(function () {});
  }

  // ---------- overview (O): every beat, click to jump ----------
  function buildOverview() {
    overview.innerHTML = '<h2>All beats · Esc to close</h2><div class="overview-grid">' + BEATS.map(function (b, n) {
      var words = (b.thoughts || []).map(function (t) { return t.text.replace(/\*\*/g, ''); }).join(' ');
      return '<button data-n="' + n + '"><small>' + (n + 1) + ' · ' + b.id + '</small><span>' +
        (words || '(no words)').replace(/</g, '&lt;') + '</span></button>';
    }).join('') + '</div>';
    overview.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-n]');
      if (b) { toggleOverview(false); show(+b.dataset.n, true); }
      else if (e.target === overview) toggleOverview(false);
    });
  }
  function markOverview() {
    var bs = overview.querySelectorAll('button[data-n]');
    for (var n = 0; n < bs.length; n++) bs[n].classList.toggle('current', +bs[n].dataset.n === current);
  }
  function toggleOverview(open) {
    overview.hidden = !open;
    if (open) { markOverview(); var c = overview.querySelector('.current'); if (c) c.focus(); }
  }
  buildOverview();

  // ---------- start where the address says ----------
  function fromHash() {
    var n = parseInt(location.hash.slice(1), 10);
    return isNaN(n) ? 0 : n - 1;
  }
  window.addEventListener('hashchange', function () { var n = fromHash(); if (n !== current) show(n, true); });
  show(fromHash(), true);
  if (fromHash() === 0) flashHud();
})();
