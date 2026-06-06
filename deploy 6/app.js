/* ============================================================
   PitchWise — interactions
   Subtle, premium motion only. No heavy animation.
   ============================================================ */
(function () {
  "use strict";

  /* ---- Sticky nav hairline on scroll ---- */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (window.scrollY > 8) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Scroll reveal ---- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- FAQ accordion ---- */
  var items = document.querySelectorAll(".faq-item");
  items.forEach(function (item) {
    var q = item.querySelector(".faq-q");
    var a = item.querySelector(".faq-a");
    q.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      items.forEach(function (other) {
        other.classList.remove("open");
        other.querySelector(".faq-a").style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add("open");
        a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });

  /* ---- Audit score count-up (fires when in view) ---- */
  var scoreEl = document.getElementById("scoreNum");
  if (scoreEl) {
    var target = 41; // illustrative "before" score — a deck needing work
    var played = false;
    function countUp() {
      if (played) return;
      played = true;
      var start = null;
      var dur = 1100;
      function frame(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        var val = Math.round(eased * target);
        scoreEl.innerHTML = val + '<span class="d">/100</span>';
        if (p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }
    if ("IntersectionObserver" in window) {
      var sio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { countUp(); sio.disconnect(); } });
      }, { threshold: 0.5 });
      sio.observe(scoreEl);
    } else {
      countUp();
    }
  }
  /* ---- Funded deck patterns rail ---- */
  (function () {
    var scroller = document.getElementById("fpScroller");
    if (!scroller) return;
    var prev = document.querySelector(".fp-prev");
    var next = document.querySelector(".fp-next");
    var cards = Array.prototype.slice.call(scroller.querySelectorAll(".fp-card"));
    if (!cards.length) return;

    function step() {
      var card = cards[0];
      var styles = window.getComputedStyle(scroller);
      var gap = parseFloat(styles.columnGap || styles.gap || "20") || 20;
      return card.offsetWidth + gap;
    }

    function updateUI() {
      var maxScroll = scroller.scrollWidth - scroller.clientWidth - 2;
      if (prev) prev.disabled = scroller.scrollLeft <= 2;
      if (next) next.disabled = scroller.scrollLeft >= maxScroll;
    }

    if (prev) prev.addEventListener("click", function () {
      scroller.scrollBy({ left: -step(), behavior: "smooth" });
    });
    if (next) next.addEventListener("click", function () {
      scroller.scrollBy({ left: step(), behavior: "smooth" });
    });

    var raf = null;
    scroller.addEventListener("scroll", function () {
      if (raf) return;
      raf = requestAnimationFrame(function () { raf = null; updateUI(); });
    });
    window.addEventListener("resize", updateUI);
    updateUI();
  })();
})();
