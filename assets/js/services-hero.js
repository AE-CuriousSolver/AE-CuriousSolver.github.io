// Services hero, in two screens that scroll normally:
//  1. Title and question on the left; the founders' frictions drift around, hovering in slow circles.
//  2. Scrolling down, more bubbles appear, they all settle around the blueprint and link up to it,
//     and the answer appears on the right.
// With reduced motion the finished picture is shown and nothing moves.
(function () {
  var hero = document.querySelector('[data-sv-scroll]');
  if (!hero) return;

  var stage = hero.querySelector('.sv-stage');
  var svg = hero.querySelector('.sv-visual');
  var answer = hero.querySelector('.sv-answer');
  var blueprint = svg.querySelector('.sv-blueprint');
  var detail = svg.querySelector('.sv-blueprint-detail');
  var bubbles = Array.prototype.slice.call(svg.querySelectorAll('.sv-bubble'));
  var inners = bubbles.map(function (b) { return b.querySelector('.sv-bubble-in'); });
  var lines = Array.prototype.slice.call(svg.querySelectorAll('.sv-line'));
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Bubble order: deadlines, budget, features, tech, vision, team, customers, data.
  // Each links to the blueprint (-1) or to another bubble, so the finished picture isn't a perfect ring.
  var LINK = [1, -1, -1, -1, -1, -1, 2, -1];

  // Positions as fractions of the hero's width and height. The first screen is roughly the top half.
  var LAYOUTS = {
    wide: {
      chaos: [[0.62, 0.10], [0.86, 0.18], [0.56, 0.30], [0.80, 0.36], [0.18, 0.43], [0.42, 0.48], [0.90, 0.55], [0.64, 0.60]],
      order: [[0.60, 0.53], [0.55, 0.62], [0.30, 0.575], [0.54, 0.86], [0.09, 0.77], [0.16, 0.93], [0.13, 0.53], [0.42, 0.95]],
      bp: [0.33, 0.76],
      bpWidth: [190, 0.24, 270]
    },
    tall: {
      chaos: [[0.26, 0.27], [0.76, 0.23], [0.60, 0.35], [0.22, 0.42], [0.80, 0.47], [0.32, 0.54], [0.72, 0.59], [0.20, 0.65]],
      order: [[0.86, 0.585], [0.74, 0.665], [0.26, 0.665], [0.86, 0.795], [0.13, 0.795], [0.27, 0.90], [0.12, 0.59], [0.73, 0.90]],
      bp: [0.5, 0.78],
      bpWidth: [150, 0.4, 190]
    }
  };

  var orbit = bubbles.map(function (b, i) { return { phase: i * 1.7, speed: 0.32 + (i % 4) * 0.07 }; });

  var W = 0, H = 0, R = 42, layout, bpW, bpH;

  function measure() {
    layout = window.innerWidth < 760 ? LAYOUTS.tall : LAYOUTS.wide;
    W = stage.clientWidth;
    H = stage.clientHeight;
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    R = Math.max(28, Math.min(42, W * 0.045));
    var b = layout.bpWidth;
    bpW = Math.max(b[0], Math.min(b[2], W * b[1]));
    bpH = bpW * 150 / 220;
  }

  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function span(p, from, to) { return ease(clamp((p - from) / (to - from))); }

  // Where a line from the blueprint's centre towards (x, y) leaves its edge.
  function edgePoint(cx, cy, x, y) {
    var dx = x - cx, dy = y - cy;
    var t = Math.min(dx ? (bpW / 2) / Math.abs(dx) : 1e9, dy ? (bpH / 2) / Math.abs(dy) : 1e9);
    return [cx + dx * t, cy + dy * t];
  }

  function render(p, time) {
    var cx = layout.bp[0] * W, cy = layout.bp[1] * H;
    var shown = span(p, 0.25, 0.65);
    blueprint.setAttribute('transform', 'translate(' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ') scale(' + ((bpW / 220) * (0.85 + 0.15 * shown)).toFixed(3) + ')');
    blueprint.style.opacity = shown;
    detail.style.opacity = span(p, 0.6, 0.82);

    var pos = bubbles.map(function (bubble, i) {
      var o = orbit[i];
      var settle = span(p, 0.12 + i * 0.04, 0.68 + i * 0.03);
      var from = layout.chaos[i], to = layout.order[i];
      var drift = (W < 500 ? 10 : 16) * (1 - 0.85 * settle);
      var angle = time * o.speed + o.phase;
      var x = (from[0] + (to[0] - from[0]) * settle) * W + Math.cos(angle) * drift;
      var y = (from[1] + (to[1] - from[1]) * settle) * H + Math.sin(angle) * drift * 0.8;
      bubble.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')');

      // The first four are there from the start; the rest fade in as you scroll down to them.
      var seen = i < 4 ? 1 : 0.25 + 0.75 * span(p, 0.0, 0.35);
      inners[i].setAttribute('transform', 'scale(' + (R / 42).toFixed(3) + ')');
      inners[i].style.opacity = seen;
      return [x, y];
    });

    lines.forEach(function (line, i) {
      var a = pos[i], b;
      if (LINK[i] < 0) b = edgePoint(cx, cy, a[0], a[1]);
      else b = pos[LINK[i]];
      line.setAttribute('d', 'M' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + ' L' + b[0].toFixed(1) + ' ' + b[1].toFixed(1));
      line.style.strokeDasharray = '1';
      line.style.strokeDashoffset = 1 - span(p, 0.62 + i * 0.025, 0.85 + i * 0.02);
    });

    var said = span(p, 0.78, 0.96);
    answer.style.opacity = said;
    answer.style.transform = 'translateY(' + ((1 - said) * 16).toFixed(1) + 'px)';
  }

  hero.classList.add('sv-live');
  measure();

  if (reduce) {
    render(1, 0);
    window.addEventListener('resize', function () { measure(); render(1, 0); });
    return;
  }

  var target = 0, current = 0, running = false, visible = true;

  // 0 at the top of the page; 1 once the bottom of the hero reaches the bottom of the screen.
  function readScroll() {
    var travel = hero.offsetHeight - window.innerHeight * 0.92;
    target = travel > 0 ? clamp(-hero.getBoundingClientRect().top / travel) : 1;
  }

  function frame(now) {
    if (!visible) { running = false; return; }
    current += (target - current) * 0.1;
    render(current, now / 1000);
    requestAnimationFrame(frame);
  }

  function start() {
    if (!running) { running = true; requestAnimationFrame(frame); }
  }

  readScroll();
  current = target;
  window.addEventListener('scroll', readScroll, { passive: true });
  window.addEventListener('resize', function () { measure(); readScroll(); });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) start();
    }).observe(hero);
  }
  start();
})();
