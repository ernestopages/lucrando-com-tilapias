(function () {
  'use strict';

  /* ---- DYNAMIC OFFER DATES ---- */
  function setOfferDates() {
    var months = [
      'janeiro','fevereiro','março','abril','maio','junho',
      'julho','agosto','setembro','outubro','novembro','dezembro'
    ];
    var today = new Date();
    var d0 = new Date(today); d0.setDate(today.getDate() - 2);
    var d1 = new Date(today); d1.setDate(today.getDate() - 1);
    var fmt = function (n) { return String(n).padStart(2, '0'); };
    var el = document.getElementById('offer-dates');
    if (el) {
      el.textContent =
        fmt(d0.getDate()) + ', ' +
        fmt(d1.getDate()) + ' e ' +
        fmt(today.getDate()) + ' de ' +
        months[today.getMonth()];
    }
  }

  /* ---- COUNTDOWN TIMER (30 min, persistent) ---- */
  function initTimer() {
    var KEY = 'lct_timer_end';
    var DURATION = 30 * 60 * 1000;
    var el = document.getElementById('countdown');
    if (!el) return;

    var endTime = parseInt(localStorage.getItem(KEY), 10);
    if (!endTime || endTime <= Date.now()) {
      endTime = Date.now() + DURATION;
      localStorage.setItem(KEY, String(endTime));
    }

    function tick() {
      var remaining = endTime - Date.now();
      if (remaining <= 0) {
        endTime = Date.now() + DURATION;
        localStorage.setItem(KEY, String(endTime));
        remaining = DURATION;
      }
      var mins = Math.floor(remaining / 60000);
      var secs = Math.floor((remaining % 60000) / 1000);
      el.textContent =
        String(mins).padStart(2, '0') + ':' +
        String(secs).padStart(2, '0');
    }

    tick();
    setInterval(tick, 1000);
  }

  /* ---- TESTIMONIAL CAROUSEL ---- */
  function initCarousel() {
    var track = document.getElementById('carousel-track');
    var dotsContainer = document.getElementById('carousel-dots');
    if (!track || !dotsContainer) return;

    var items = Array.prototype.slice.call(track.querySelectorAll('.carousel__item'));
    var count = items.length;
    if (count === 0) return;

    /* scroll only inside the track — never affect page scroll position */
    function scrollToIndex(idx) {
      var item = items[idx];
      var target = item.offsetLeft - (track.offsetWidth - item.offsetWidth) / 2;
      track.scrollTo({ left: target, behavior: 'smooth' });
    }

    /* build dots */
    var dots = items.map(function (item, i) {
      var dot = document.createElement('button');
      dot.className = 'carousel__dot';
      dot.setAttribute('aria-label', 'Depoimento ' + (i + 1));
      dot.addEventListener('click', function () { scrollToIndex(i); });
      dotsContainer.appendChild(dot);
      return dot;
    });

    function getActiveIndex() {
      var center = track.scrollLeft + track.offsetWidth / 2;
      var minDist = Infinity;
      var activeIdx = 0;
      items.forEach(function (item, i) {
        var dist = Math.abs(item.offsetLeft + item.offsetWidth / 2 - center);
        if (dist < minDist) { minDist = dist; activeIdx = i; }
      });
      return activeIdx;
    }

    function updateDots() {
      var idx = getActiveIndex();
      dots.forEach(function (dot, i) {
        dot.classList.toggle('carousel__dot--active', i === idx);
      });
      return idx;
    }

    updateDots();
    track.addEventListener('scroll', updateDots, { passive: true });

    /* auto-play */
    var isPaused = false;
    track.addEventListener('touchstart', function () { isPaused = true; }, { passive: true });
    track.addEventListener('touchend', function () {
      setTimeout(function () { isPaused = false; }, 3200);
    }, { passive: true });
    track.addEventListener('mouseenter', function () { isPaused = true; });
    track.addEventListener('mouseleave', function () { isPaused = false; });

    setInterval(function () {
      if (isPaused) return;
      var next = (getActiveIndex() + 1) % count;
      scrollToIndex(next);
    }, 3800);
  }

  /* ---- SMOOTH SCROLL ANCHORS ---- */
  function initAnchors() {
    var oferta = document.getElementById('oferta');
    if (!oferta) return;
    document.querySelectorAll('a[href="#oferta"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        oferta.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  /* ---- INIT ---- */
  document.addEventListener('DOMContentLoaded', function () {
    setOfferDates();
    initTimer();
    initCarousel();
    initAnchors();
  });

}());
