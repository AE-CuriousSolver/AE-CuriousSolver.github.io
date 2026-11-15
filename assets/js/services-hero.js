// Services hero, three screens:
//  1. Landing: "Someone on your side" alone. After a pause (or the first scroll down) it glides slowly on.
//  2. Diagram: the screen holds while you scroll, and the picture follows your scrolling, forwards and
//     back. Everything moves as one transition: the noise leaves as what you leave with comes in, the
//     worries settle and connect, the question gives way to the blueprint, and it all arrives together.
//     The last stretch of scrolling is a pause on the finished diagram.
//  3. Answer: "From abstract ideas to buildable products" fades up on its own screen as you scroll to it.
// With reduced motion: no gliding; the finished diagram and the answer simply show.
//
// TO REARRANGE THE BUBBLES OR THEIR CONNECTIONS: open the page with ?arrange on the end of the address
// (e.g. localhost:4000/services/?arrange). Drag, connect, preview, then copy what the panel gives you
// over the matching blocks below.
(function () {
  // ======================================================================================
  // SETTINGS: everything you might want to tweak lives here.
  // Positions are [across, down] as fractions of the diagram screen: 0 = left/top, 1 = right/bottom.
  // Bubbles are matched by their label in _data/services/page.yml.
  // How long the screen holds while you scroll is in assets/css/site.css (search "HOLD LENGTH").
  // ======================================================================================
  var SETTINGS = {
    autoAdvance: 3300,    // ms on the landing (including the title scrolling in) before it glides on by itself (0 = wait for a scroll)
    glideTime: 1600,      // ms the glide from the landing to the diagram takes: higher = slower
    pauseAfterGlide: 600, // ms scrolling is held after arriving, so a flick's momentum doesn't start the bubbles
    finishAt: 0.75,       // share of the hold spent moving; the rest is a pause on the finished diagram
    smoothing: 0.08,      // how quickly the picture catches up with your scrolling: lower = smoother
    // The messy start: restless, irregular movement that calms to stillness as everything settles.
    restless: {
      wander: 26,         // px they drift off course, slowly and unevenly
      tremble: 3,         // px of fast, nervous shake
      jolt: 19,           // px of sudden small jumps now and then
      joltsPerSecond: 0.9,
      tilt: 9,            // degrees they rock
      pulse: 0.09         // how much they swell and shrink
    },
    calmDrift: 2,         // px of gentle float once settled

    // What each bubble connects to once settled: "centre" (the blueprint), another bubble's label,
    // a list of several (e.g. ["data", "technology"]), or "none". Anything not listed connects to the centre.
    links: {
      "product vision":         "centre",
      "budget":                 "centre",
      "deadlines":              "centre",
      "team work":              "actionable direction",
      "technology":             "centre",
      "data":                   "centre",
      "security & protection":  "centre",
      "system maintenance":     "centre",
      "features":               "centre",
      "user experience":        "product vision",
      "source of truth":        "centre",
      "actionable direction":   "centre",
      "lead with confidence":   "centre",
      "aware and prepared":     ["security & protection", "system maintenance"]
    },

    wide: {
      centre: [0.5, 0.5],
      centreWidth: [220, 0.22, 290],   // blueprint width: [smallest px, share of screen width, largest px]
      ovalScale: [0.7, 1280, 1],      // bubble size: [smallest, screen width for full size, largest]
      positions: {
        // label:                 start (messy)     end (settled)
        "product vision":         [[0.86, 0.29], [0.34, 0.25]],
        "budget":                 [[0.31, 0.24], [0.76, 0.69]],
        "deadlines":              [[0.12, 0.59], [0.62, 0.22]],
        "team work":              [[0.51, 0.87], [0.87, 0.23]],
        "technology":             [[0.88, 0.76], [0.67, 0.85]],
        "data":                   [[0.42, 0.09], [0.37, 0.82]],
        "security & protection":  [[0.76, 0.15], [0.24, 0.42]],
        "system maintenance":     [[0.16, 0.85], [0.25, 0.69]],
        "features":               [[0.11, 0.36], [0.75, 0.49]],
        "user experience":        [[0.83, 0.52], [0.23, 0.17]],
        "technical jargon":       [[0.15, 0.15], [-0.25, 0.74]],
        "misaligned development": [[0.59, 0.21], [1.25, 0.70]],
        "bulldozing tech talks":  [[0.73, 0.76], [-0.25, 0.92]],
        "lingering discussions":  [[0.31, 0.74], [1.25, 0.05]],
        "source of truth":        [[0.30, -0.15], [0.47, 0.15]],
        "actionable direction":   [[0.44, -0.20], [0.73, 0.31]],
        "lead with confidence":   [[0.56, -0.20], [0.52, 0.79]],
        "aware and prepared":     [[0.70, -0.15], [0.11, 0.55]]
      }
    },
    tall: {               // phones (under 760px wide)
      centre: [0.5, 0.5],
      centreWidth: [150, 0.42, 180],
      ovalScale: [0.55, 680, 0.62],
      positions: {
        "product vision":         [[0.70, 0.24], [0.50, 0.37]],
        "budget":                 [[0.22, 0.17], [0.20, 0.35]],
        "deadlines":              [[0.80, 0.35], [0.80, 0.35]],
        "team work":              [[0.45, 0.30], [0.50, 0.30]],
        "technology":             [[0.78, 0.64], [0.50, 0.63]],
        "data":                   [[0.28, 0.72], [0.20, 0.67]],
        "security & protection":  [[0.55, 0.82], [0.80, 0.67]],
        "system maintenance":     [[0.20, 0.88], [0.50, 0.71]],
        "features":               [[0.18, 0.34], [0.16, 0.50]],
        "user experience":        [[0.82, 0.90], [0.84, 0.50]],
        "technical jargon":       [[0.30, 0.64], [-0.40, 0.64]],
        "misaligned development": [[0.68, 0.74], [1.40, 0.76]],
        "bulldozing tech talks":  [[0.15, 0.08], [-0.40, 0.05]],
        "lingering discussions":  [[0.85, 0.12], [1.40, 0.10]],
        "source of truth":        [[0.28, -0.10], [0.28, 0.16]],
        "actionable direction":   [[0.72, -0.10], [0.72, 0.16]],
        "lead with confidence":   [[0.28, -0.15], [0.28, 0.23]],
        "aware and prepared":     [[0.72, -0.15], [0.72, 0.23]]
      }
    }
  };
  // ======================================================================================

  var hero = document.querySelector('[data-sv-scroll]');
  if (!hero) return;

  var pin = hero.querySelector('.sv-pin');
  var stage = hero.querySelector('.sv-stage');
  var svg = hero.querySelector('.sv-visual');
  var question = hero.querySelector('.sv-question');
  var answer = hero.querySelector('.sv-answer');
  var blueprint = svg.querySelector('.sv-blueprint');
  var noise = Array.prototype.slice.call(svg.querySelectorAll('.sv-noise .sv-oval'));
  var bubbles = Array.prototype.slice.call(svg.querySelectorAll('.sv-bubbles .sv-oval'));
  var outcomes = Array.prototype.slice.call(svg.querySelectorAll('.sv-outcomes .sv-oval'));
  var lineGroup = svg.querySelector('.sv-lines');
  var lines = [];
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var arrange = /[?&]arrange/.test(location.search);

  var W = 0, H = 0, layout, bpW, bpH, scale = 1, where = {};

  function measure() {
    layout = window.innerWidth < 760 ? SETTINGS.tall : SETTINGS.wide;
    W = stage.clientWidth;
    H = stage.clientHeight;
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    var o = layout.ovalScale;
    scale = Math.max(o[0], Math.min(o[2], W / o[1]));
    var c = layout.centreWidth;
    bpW = Math.max(c[0], Math.min(c[2], W * c[1]));
    bpH = bpW * 150 / 240;
  }

  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function ease(t) { return -(Math.cos(Math.PI * t) - 1) / 2; }   // gentle in and out
  function span(p, from, to) { return ease(clamp((p - from) / (to - from))); }
  function mix(a, b, t) { return a + (b - a) * t; }
  function label(g) { return g.getAttribute('data-label'); }
  function spot(g) {
    return layout.positions[label(g)] || [[0.5, 0.95], [0.5, 0.95]];   // unknown label: parks at the bottom
  }
  function targetsOf(name) {
    var t = SETTINGS.links[name];
    if (t === undefined) return ['centre'];
    if (t === 'none' || t === null) return [];
    return Array.isArray(t) ? t.slice() : [t];
  }
  // One line per connection, drawn in data order so outcomes' lines come last.
  function buildLines() {
    while (lineGroup.firstChild) lineGroup.removeChild(lineGroup.firstChild);
    lines = [];
    bubbles.concat(outcomes).forEach(function (g) {
      targetsOf(label(g)).forEach(function (to) {
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('class', 'sv-line');
        path.setAttribute('stroke', '#127C80');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('filter', 'url(#rough-lines)');
        path.setAttribute('data-from', label(g));
        path.setAttribute('data-to', to);
        lineGroup.appendChild(path);
        lines.push(path);
      });
    });
  }
  // Cheap repeatable "random" number between -1 and 1 for a given pair of inputs
  function hash(a, b) { var x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return (x - Math.floor(x)) * 2 - 1; }
  // Restless offset for bubble i at time t: uneven wandering + nervous shake + occasional jolts
  function restless(i, t) {
    var R = SETTINGS.restless, ph = i * 1.93;
    var wx = Math.sin(t * 0.83 + ph) * 0.6 + Math.sin(t * 2.17 + ph * 1.7) * 0.4;
    var wy = Math.sin(t * 0.71 + ph * 2.3) * 0.6 + Math.sin(t * 1.93 + ph * 0.6) * 0.4;
    var sx = Math.sin(t * 13.1 + ph) * Math.sin(t * 7.3 + ph * 3.1);
    var sy = Math.sin(t * 11.7 + ph * 2.2) * Math.sin(t * 6.1 + ph);
    var beat = t * R.joltsPerSecond + i * 0.37, n = Math.floor(beat), f = beat - n;
    var snap = Math.min(1, f / 0.12);   // each jolt happens fast, then holds
    var jx = hash(n - 1, i) + (hash(n, i) - hash(n - 1, i)) * snap;
    var jy = hash(i, n - 1) + (hash(i, n) - hash(i, n - 1)) * snap;
    return {
      x: wx * R.wander + sx * R.tremble + jx * R.jolt,
      y: wy * R.wander + sy * R.tremble + jy * R.jolt,
      tilt: (Math.sin(t * 1.7 + ph) * 0.7 + Math.sin(t * 4.3 + ph * 2) * 0.3) * R.tilt,
      pulse: 1 + Math.sin(t * 2.9 + ph) * R.pulse
    };
  }
  function place(g, x, y, s, opacity, tilt) {
    g.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')');
    g.firstElementChild.setAttribute('transform', 'scale(' + s.toFixed(3) + ')' + (tilt ? ' rotate(' + tilt.toFixed(2) + ')' : ''));
    g.style.opacity = opacity;
  }
  function edgePoint(cx, cy, x, y) {
    var dx = x - cx, dy = y - cy;
    var t = Math.min(dx ? (bpW / 2) / Math.abs(dx) : 1e9, dy ? (bpH / 2) / Math.abs(dy) : 1e9);
    return [cx + dx * t, cy + dy * t];
  }

  // Draw the diagram at progress p (0 = messy, 1 = settled). One transition: everything starts moving
  // together and arrives together. time keeps loose bubbles gently circling.
  function render(p, time, still) {
    var cx = layout.centre[0] * W, cy = layout.centre[1] * H;
    var move = ease(p);
    var chaos = still ? 0 : Math.pow(1 - move, 1.6);    // full restlessness at the start, none once settled
    var calm = still ? 0 : SETTINGS.calmDrift * move;
    where = {};

    noise.concat(bubbles, outcomes).forEach(function (g, i) {
      var s = spot(g);
      var r = restless(i, time);
      var a = time * 0.35 + i * 1.7;
      var x = mix(s[0][0], s[1][0], move) * W + r.x * chaos + Math.cos(a) * calm;
      var y = mix(s[0][1], s[1][1], move) * H + r.y * chaos + Math.sin(a) * calm;
      var isNoise = i < noise.length;
      place(g, x, y, scale * (1 + (r.pulse - 1) * chaos), isNoise ? 1 - span(p, 0.3, 0.9) : 1, r.tilt * chaos);
      if (!isNoise) where[label(g)] = [x, y];
    });

    var centreShown = span(p, 0.25, 1);
    blueprint.setAttribute('transform', 'translate(' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ') scale(' + ((bpW / 240) * (0.85 + 0.15 * centreShown)).toFixed(3) + ')');
    blueprint.style.opacity = centreShown;

    var drawn = span(p, 0.55, 1);   // links draw in as everything closes in on its place
    lines.forEach(function (line) {
      var from = where[line.getAttribute('data-from')];
      var toLabel = line.getAttribute('data-to');
      var to = !from ? null : toLabel === 'centre' ? edgePoint(cx, cy, from[0], from[1]) : where[toLabel];
      if (!to) { line.style.opacity = 0; return; }
      line.setAttribute('d', 'M' + from[0].toFixed(1) + ' ' + from[1].toFixed(1) + ' L' + to[0].toFixed(1) + ' ' + to[1].toFixed(1));
      // Draw in by measuring the real length (works the same in every browser, Safari included)
      var len = Math.hypot(to[0] - from[0], to[1] - from[1]) + 4;
      line.style.strokeDasharray = len.toFixed(1) + ' ' + (len + 8).toFixed(1);
      line.style.strokeDashoffset = (len * (1 - drawn)).toFixed(1);
      line.style.opacity = 1;
    });

    var q = 1 - span(p, 0, 0.5);
    question.style.opacity = q;
    question.style.transform = 'translate(-50%, -50%) scale(' + (0.94 + 0.06 * q).toFixed(3) + ')';
  }

  measure();
  buildLines();

  if (arrange) { arrangeMode(); return; }

  // ---------------------------------------------------------------------------------------
  // Normal page
  // ---------------------------------------------------------------------------------------

  // The answer fades up (and its highlighter swipes in) when it reaches the middle of the screen.
  if ('IntersectionObserver' in window && !reduce) {
    new IntersectionObserver(function (entries) {
      answer.classList.toggle('on', entries[0].isIntersecting);
    }, { rootMargin: '-30% 0px -30% 0px' }).observe(answer);
  } else {
    answer.classList.add('on');
  }

  if (reduce) {
    question.classList.add('on');
    hero.classList.add('sv-still');
    render(1, 0, true);
    window.addEventListener('resize', function () { measure(); render(1, 0, true); });
    return;
  }

  // ---- 1. Landing → diagram: a slow glide, after a pause or on the first scroll down ----
  function pinTop() { return pin.getBoundingClientRect().top + window.scrollY; }
  var gliding = false, glided = false;
  function glide() {
    if (glided) return;
    glided = gliding = true;
    // Switch off the browser's own smooth scrolling while we glide, or each step gets smoothed again
    // and the slide judders (Safari especially).
    var root = document.documentElement, was = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    var from = window.scrollY, to = pinTop(), t0 = performance.now();
    (function step(now) {
      var t = clamp((now - t0) / SETTINGS.glideTime);
      window.scrollTo(0, Math.round(from + (to - from) * ease(t)));
      if (t < 1) { requestAnimationFrame(step); return; }
      root.style.scrollBehavior = was;
      // a short beat on the diagram before scrolling moves anything
      setTimeout(function () { gliding = false; }, SETTINGS.pauseAfterGlide);
    })(t0);
  }
  var touchY = null;
  function wantsDown(e) {
    if (e.type === 'wheel') return e.deltaY > 0;
    if (e.type === 'keydown') return ['ArrowDown', 'PageDown', ' ', 'Spacebar'].indexOf(e.key) !== -1;
    if (e.type === 'touchmove' && touchY !== null) return touchY - e.touches[0].clientY > 6;
    return false;
  }
  function intercept(e) {
    if (gliding) { e.preventDefault(); return; }   // let the glide finish without being knocked off course
    if (!glided && window.scrollY < pinTop() - 4 && wantsDown(e)) { e.preventDefault(); glide(); }
  }
  window.addEventListener('touchstart', function (e) { touchY = e.touches[0].clientY; }, { passive: true });
  ['wheel', 'touchmove', 'keydown'].forEach(function (type) {
    window.addEventListener(type, intercept, { passive: false });
  });
  if (SETTINGS.autoAdvance && window.scrollY < 10) {
    setTimeout(function () { if (window.scrollY < 10) glide(); }, SETTINGS.autoAdvance);
  }

  // ---- 2. Diagram: follows your scrolling while the screen holds ----
  var target = 0, current = 0;
  function readScroll() {
    var travel = (pin.offsetHeight - stage.offsetHeight) * SETTINGS.finishAt;
    target = travel > 0 ? clamp(-pin.getBoundingClientRect().top / travel) : 1;
    if (target > 0.02) question.classList.add('on');
  }
  setTimeout(function () { question.classList.add('on'); }, SETTINGS.autoAdvance + SETTINGS.glideTime);   // underline under the question

  var visible = true, running = false;
  function frame(now) {
    current += (target - current) * SETTINGS.smoothing;
    if (Math.abs(target - current) < 0.0005) current = target;
    render(current, now / 1000, false);
    if (visible) requestAnimationFrame(frame); else running = false;
  }
  function start() { if (!running) { running = true; requestAnimationFrame(frame); } }

  readScroll();
  current = target;
  window.addEventListener('scroll', readScroll, { passive: true });
  window.addEventListener('resize', function () { measure(); readScroll(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) start();
    }).observe(stage);
  }
  start();

  // ---------------------------------------------------------------------------------------
  // Arrange mode (?arrange): drag bubbles at the start or the end, set connections, preview the
  // movement, then copy the result into SETTINGS above. Edits are kept in this browser until you
  // press "Reset to the file", so switching views or reloading doesn't lose them.
  // ---------------------------------------------------------------------------------------
  function arrangeMode() {
    var key = 'sv-arrange-' + (layout === SETTINGS.tall ? 'tall' : 'wide');
    try {
      var saved = JSON.parse(localStorage.getItem(key) || 'null');
      if (saved) { Object.assign(layout.positions, saved.positions); Object.assign(SETTINGS.links, saved.links); buildLines(); }
    } catch (e) { /* storage blocked: edits just won't survive a reload */ }
    function save() {
      try { localStorage.setItem(key, JSON.stringify({ positions: layout.positions, links: SETTINGS.links })); } catch (e) {}
    }

    hero.classList.add('sv-arranging');
    question.classList.add('on');
    answer.classList.add('on');
    var p = 1, tool = 'move', picked = null, playing = false;

    var panel = document.createElement('div');
    panel.className = 'sv-arrange-panel';
    panel.innerHTML =
      '<div class="sv-arrange-row"><strong>Arrange</strong><span class="sv-arrange-which"></span>' +
        '<button type="button" class="sv-arrange-hide" data-hide>Hide</button></div>' +
      '<div class="sv-arrange-body">' +
        '<div class="sv-arrange-row">' +
          '<button type="button" data-view="0">Start</button>' +
          '<input type="range" min="0" max="1" step="0.01" value="1" data-slider aria-label="Preview from start to end">' +
          '<button type="button" data-view="1">End</button>' +
          '<button type="button" data-play>▶ Play</button>' +
        '</div>' +
        '<div class="sv-arrange-row">' +
          '<button type="button" data-tool="move">Move bubbles</button>' +
          '<button type="button" data-tool="link">Set connections</button>' +
        '</div>' +
        '<p class="sv-arrange-hint"></p>' +
        '<p class="sv-arrange-label">Positions: copy over the lines inside <code>positions: { … }</code> in <code><span data-layoutname></span></code></p>' +
        '<textarea readonly rows="5" wrap="off" data-out="positions"></textarea>' +
        '<p class="sv-arrange-label">Connections: copy over the lines inside <code>links: { … }</code></p>' +
        '<textarea readonly rows="4" wrap="off" data-out="links"></textarea>' +
        '<div class="sv-arrange-row">' +
          '<button type="button" class="is-solid" data-copy="positions">Copy positions</button>' +
          '<button type="button" class="is-solid" data-copy="links">Copy connections</button>' +
          '<button type="button" data-reset>Reset to the file</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(panel);
    var slider = panel.querySelector('[data-slider]');
    panel.querySelector('[data-layoutname]').textContent = layout === SETTINGS.tall ? 'tall' : 'wide';
    panel.querySelector('.sv-arrange-which').textContent = layout === SETTINGS.tall ? 'phone layout' : 'wide layout';

    function fmt(n) { return (Math.round(n * 100) / 100).toFixed(2); }
    function pad(name) { return ('"' + name + '":').padEnd(26, ' '); }
    function outPositions() {
      return Object.keys(layout.positions).map(function (name) {
        var pos = layout.positions[name];
        return '        ' + pad(name) + '[[' + fmt(pos[0][0]) + ', ' + fmt(pos[0][1]) + '], [' + fmt(pos[1][0]) + ', ' + fmt(pos[1][1]) + ']]';
      }).join(',\n');
    }
    function outLinks() {
      return bubbles.concat(outcomes).map(function (g) {
        var t = targetsOf(label(g));
        var v = t.length === 0 ? '"none"' : t.length === 1 ? '"' + t[0] + '"' : '[' + t.map(function (x) { return '"' + x + '"'; }).join(', ') + ']';
        return '      ' + pad(label(g)) + v;
      }).join(',\n');
    }
    function refresh() {
      render(p, 0, true);
      panel.querySelector('[data-out="positions"]').value = outPositions();
      panel.querySelector('[data-out="links"]').value = outLinks();
      slider.value = p;
      panel.querySelectorAll('[data-tool]').forEach(function (b) { b.classList.toggle('is-on', b.getAttribute('data-tool') === tool); });
      panel.querySelectorAll('[data-view]').forEach(function (b) { b.classList.toggle('is-on', +b.getAttribute('data-view') === p); });
      svg.querySelectorAll('.is-picked').forEach(function (g) { g.classList.remove('is-picked'); });
      if (picked) picked.classList.add('is-picked');
      var hint = panel.querySelector('.sv-arrange-hint');
      if (tool === 'link') {
        hint.textContent = picked
          ? 'Click what "' + label(picked) + '" connects to: other bubbles and/or the blueprint (click again to remove). Click "' + label(picked) + '" itself when you\'re done.'
          : 'Click a bubble to choose what it connects to. It can connect to several.';
      } else {
        hint.textContent = p === 0 ? 'Dragging moves where bubbles START (messy).'
          : p === 1 ? 'Dragging moves where bubbles END (settled).'
          : 'Previewing. Press Start or End to drag again.';
      }
    }

    panel.querySelectorAll('[data-view]').forEach(function (b) {
      b.addEventListener('click', function () { p = +b.getAttribute('data-view'); refresh(); });
    });
    slider.addEventListener('input', function () { p = +slider.value; refresh(); });
    panel.querySelector('[data-play]').addEventListener('click', function () {
      if (playing) return;
      playing = true;
      var t0 = performance.now();
      (function step(now) {
        p = clamp((now - t0) / 3000);
        refresh();
        if (p < 1) requestAnimationFrame(step); else playing = false;
      })(t0);
    });
    panel.querySelectorAll('[data-tool]').forEach(function (b) {
      b.addEventListener('click', function () { tool = b.getAttribute('data-tool'); picked = null; if (tool === 'link') p = 1; refresh(); });
    });
    panel.querySelectorAll('[data-copy]').forEach(function (b) {
      b.addEventListener('click', function () {
        var t = panel.querySelector('[data-out="' + b.getAttribute('data-copy') + '"]');
        t.select();
        var done = function () { var was = b.textContent; b.textContent = 'Copied ✓'; setTimeout(function () { b.textContent = was; }, 1500); };
        if (navigator.clipboard) navigator.clipboard.writeText(t.value).then(done); else { document.execCommand('copy'); done(); }
      });
    });
    panel.querySelector('[data-reset]').addEventListener('click', function () {
      try { localStorage.removeItem(key); } catch (e) {}
      location.reload();
    });
    panel.querySelector('[data-hide]').addEventListener('click', function () {
      var hidden = panel.classList.toggle('is-hidden');
      this.textContent = hidden ? 'Show' : 'Hide';
    });

    // Dragging (move tool, at Start or End)
    var dragging = null;
    function svgPoint(e) {
      var r = svg.getBoundingClientRect();
      return [(e.clientX - r.left) * (W / r.width), (e.clientY - r.top) * (H / r.height)];
    }
    noise.concat(bubbles, outcomes).forEach(function (g) {
      g.addEventListener('pointerdown', function (e) {
        e.preventDefault();
        if (tool === 'link') { pickForLink(g); return; }
        if (p !== 0 && p !== 1) return;
        dragging = g;
        g.setPointerCapture(e.pointerId);
      });
      g.addEventListener('pointermove', function (e) {
        if (dragging !== g) return;
        var pt = svgPoint(e), pos = layout.positions[label(g)];
        if (!pos) return;
        pos[p] = [pt[0] / W, pt[1] / H];
        refresh();
      });
      g.addEventListener('pointerup', function () { if (dragging) save(); dragging = null; });
    });

    // Connections (link tool): click a bubble, then its target
    // Click a bubble, then click its targets to add or remove them; click the bubble again to finish.
    function toggleTarget(target) {
      var name = label(picked), t = targetsOf(name), at = t.indexOf(target);
      if (at === -1) t.push(target); else t.splice(at, 1);
      SETTINGS.links[name] = t.length === 0 ? 'none' : t.length === 1 ? t[0] : t;
      buildLines();
      save();
      refresh();
    }
    function pickForLink(g) {
      if (noise.indexOf(g) !== -1) return;   // the noise never connects
      if (!picked) { picked = g; refresh(); return; }
      if (g === picked) { picked = null; refresh(); return; }
      toggleTarget(label(g));
    }
    blueprint.addEventListener('pointerdown', function (e) {
      if (tool !== 'link' || !picked) return;
      e.preventDefault();
      toggleTarget('centre');
    });

    window.addEventListener('resize', function () { measure(); refresh(); });
    refresh();
    window.scrollTo({ top: pin.getBoundingClientRect().top + window.scrollY, behavior: 'instant' });
  }
})();
