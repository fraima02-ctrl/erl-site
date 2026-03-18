/* ══════════════════════════════════════════════════════════
   EQUITY RESEARCH LAB — Main JavaScript
   ══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── Mobile Menu ── */
  var toggle   = document.getElementById('erlMenuToggle');
  var panel    = document.getElementById('erlPanel');
  var closeBtn = document.getElementById('erlMenuClose');
  var backdrop = document.getElementById('erlBackdrop');

  if (toggle && panel) {
    var scrollPos = 0;
    var isOpen = false;

    function openMenu() {
      if (isOpen) return;
      isOpen = true;
      scrollPos = window.pageYOffset;

      toggle.setAttribute('aria-expanded', 'true');
      toggle.classList.add('is-active');
      panel.setAttribute('aria-hidden', 'false');
      panel.classList.add('is-open');
      if (backdrop) backdrop.classList.add('is-visible');

      document.body.classList.add('erl-menu-locked');
      document.body.style.top = '-' + scrollPos + 'px';

      setTimeout(function () {
        if (closeBtn) closeBtn.focus();
      }, 450);
    }

    function closeMenu() {
      if (!isOpen) return;
      isOpen = false;

      toggle.setAttribute('aria-expanded', 'false');
      toggle.classList.remove('is-active');
      panel.setAttribute('aria-hidden', 'true');
      panel.classList.remove('is-open');
      if (backdrop) backdrop.classList.remove('is-visible');

      document.body.classList.remove('erl-menu-locked');
      document.body.style.top = '';
      window.scrollTo(0, scrollPos);

      toggle.focus();
    }

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      if (isOpen) closeMenu(); else openMenu();
    });

    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (backdrop) backdrop.addEventListener('click', closeMenu);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) closeMenu();
    });

    panel.querySelectorAll('a.erl-panel__link, a.erl-panel__cta').forEach(function (link) {
      link.addEventListener('click', function () {
        closeMenu();
      });
    });

    /* Focus trap */
    panel.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || !isOpen) return;
      var focusable = panel.querySelectorAll('a[href], button');
      if (!focusable.length) return;
      var first = focusable[0];
      var last  = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    });

    /* Close on desktop resize */
    var mq = window.matchMedia('(min-width: 1025px)');
    function onResize(e) { if (e.matches && isOpen) closeMenu(); }
    if (mq.addEventListener) mq.addEventListener('change', onResize);
    else mq.addListener(onResize);
  }


  /* ── Scroll Reveal ── */
  var revealEls = document.querySelectorAll('.erl-reveal');
  if (revealEls.length > 0 && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  }


  /* ── Active Nav Link ── */
  var currentPath = window.location.pathname;
  document.querySelectorAll('.erl-header__nav a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '/' && href === 'index.html')) {
      link.classList.add('is-active');
    }
  });

})();
