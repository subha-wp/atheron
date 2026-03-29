(function () {
  "use strict";

  var header = document.getElementById("header");
  var navToggle = document.getElementById("navToggle");
  var primaryNav = document.getElementById("primary-nav");
  var yearEl = document.getElementById("year");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  function onScroll() {
    if (!header) return;
    if (window.scrollY > 48) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (navToggle && primaryNav) {
    navToggle.addEventListener("click", function () {
      var open = primaryNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    primaryNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        primaryNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Count-up for metrics */
  function animateValue(el, target, isDecimal, duration) {
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = start + (target - start) * eased;
      if (isDecimal) {
        el.textContent = current.toFixed(1);
      } else {
        el.textContent = String(Math.round(current));
      }
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        if (isDecimal) {
          el.textContent = target.toFixed(1);
        } else {
          el.textContent = String(Math.round(target));
        }
      }
    }

    requestAnimationFrame(step);
  }

  var metricEls = document.querySelectorAll(".metric-value[data-target]");
  var metricObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var raw = el.getAttribute("data-target");
        if (!raw || el.dataset.animated === "1") return;
        el.dataset.animated = "1";
        var target = parseFloat(raw, 10);
        var isDecimal = raw.indexOf(".") !== -1;
        if (isDecimal) {
          el.classList.add("decimal");
        }
        animateValue(el, target, isDecimal, 1600);
      });
    },
    { threshold: 0.4 }
  );

  metricEls.forEach(function (el) {
    metricObserver.observe(el);
  });

  /* Reveal on scroll */
  var revealEls = document.querySelectorAll(".reveal");
  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealEls.forEach(function (el) {
    revealObserver.observe(el);
  });

  /* Hero reveals — run once on load */
  window.addEventListener("load", function () {
    document.querySelectorAll(".hero .reveal, .page-hero .reveal").forEach(function (el) {
      el.classList.add("is-visible");
    });
  });
})();
