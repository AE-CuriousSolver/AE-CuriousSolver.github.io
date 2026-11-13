// Small enhancements. Pages read fine without JavaScript; this adds:
// - the sticky "on this page" links on Experience, with the current section marked
// - project pop-ups ("What I'm gaining")
// - sketches that draw themselves and numbers that count up (skipped with reduced motion)
(function () {
  var root = document.documentElement;
  root.classList.add('js');

  // Let sticky elements sit just under the top navigation, whatever its height.
  var nav = document.querySelector('.site-nav');
  function setNavHeight() {
    if (nav) root.style.setProperty('--nav-h', nav.offsetHeight + 'px');
  }
  setNavHeight();
  window.addEventListener('resize', setNavHeight);

  // Project pop-ups: open from the card, close with the X, Escape or a click outside.
  document.querySelectorAll('[data-dialog]').forEach(function (button) {
    var dialog = document.getElementById(button.getAttribute('data-dialog'));
    if (!dialog || typeof dialog.showModal !== 'function') return;
    button.addEventListener('click', function () {
      dialog.showModal();
      root.classList.add('dialog-open');
    });
    dialog.addEventListener('close', function () {
      root.classList.remove('dialog-open');
      button.focus();
    });
    dialog.addEventListener('click', function (event) {
      if (event.target === dialog) dialog.close();
    });
  });

  // Mark which section of the page you're in: the last one whose top has passed under the links.
  var jumpLinks = Array.prototype.slice.call(document.querySelectorAll('.jump-links a'));
  if (jumpLinks.length) {
    var sections = jumpLinks.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });
    var ticking = false;
    function markCurrent() {
      ticking = false;
      var line = (nav ? nav.offsetHeight : 0) + 140;
      var current = -1;
      sections.forEach(function (section, i) {
        if (section && section.getBoundingClientRect().top <= line) current = i;
      });
      jumpLinks.forEach(function (a, i) {
        if (i === current) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(markCurrent); }
    }, { passive: true });
    markCurrent();
  }
})();

(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;

  document.documentElement.classList.add('motion');

  // Anything already on screen is drawn straight away, so the first view is complete.
  var drawables = Array.prototype.slice.call(document.querySelectorAll('.drawable'));
  var fold = window.innerHeight * 0.9;
  var drawObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        drawObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });

  drawables.forEach(function (el) {
    if (el.getBoundingClientRect().top < fold) {
      el.classList.add('in');
    } else {
      drawObserver.observe(el);
    }
  });

  var countObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      countObserver.unobserve(entry.target);
      var el = entry.target;
      var end = parseInt(el.getAttribute('data-count'), 10);
      var finalText = el.textContent;
      var suffix = finalText.replace(/[0-9]/g, '');
      var start = performance.now();
      (function step(now) {
        var progress = Math.min(1, (now - start) / 900);
        el.textContent = progress < 1 ? Math.round(end * progress) + suffix : finalText;
        if (progress < 1) requestAnimationFrame(step);
      })(start);
    });
  }, { threshold: 0.6 });

  // Numbers already on screen keep their final value; only ones further down count up.
  document.querySelectorAll('[data-count]').forEach(function (el) {
    if (el.getBoundingClientRect().top >= fold) countObserver.observe(el);
  });
})();
