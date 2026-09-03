(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Icons ---------- */
  if (window.lucide) lucide.createIcons();

  /* ---------- Language toggle ---------- */
  var WA_NUMBER = '353899447831';
  var MSG = {
    en: "Hi! I saw your website and I'd like to book an appointment.",
    pt: 'Olá! Vi o site e gostaria de agendar um horário.'
  };
  function waLink(lang) { return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(MSG[lang]); }

  function applyLang(lang) {
    document.documentElement.lang = (lang === 'pt') ? 'pt-BR' : 'en';
    document.documentElement.dataset.lang = lang;
    var link = waLink(lang);
    document.querySelectorAll('.wa-link, #waTop, #waFloat').forEach(function (el) { el.setAttribute('href', link); });
    document.getElementById('langLabel').textContent = (lang === 'pt') ? 'EN' : 'PT';
    try { localStorage.setItem('jr-lang', lang); } catch (e) {}
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }

  var start = 'en';
  try { var saved = localStorage.getItem('jr-lang'); if (saved === 'en' || saved === 'pt') start = saved; } catch (e) {}
  applyLang(start);

  document.getElementById('langToggle').addEventListener('click', function () {
    applyLang(document.documentElement.dataset.lang === 'pt' ? 'en' : 'pt');
  });

  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.getElementById('menuToggle');
  var menuPanel = document.getElementById('mobileMenu');
  var iconOpen = document.getElementById('menuIconOpen');
  var iconClose = document.getElementById('menuIconClose');
  var labelOpen = document.getElementById('menuLabelOpen');
  var labelClose = document.getElementById('menuLabelClose');

  function setMenu(open) {
    menuPanel.hidden = !open;
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    labelOpen.classList.toggle('hidden', open);
    labelClose.classList.toggle('hidden', !open);
    iconOpen.classList.toggle('hidden', open);
    iconClose.classList.toggle('hidden', !open);
  }
  menuBtn.addEventListener('click', function () { setMenu(menuPanel.hidden); });
  menuPanel.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !menuPanel.hidden) { setMenu(false); menuBtn.focus(); }
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth >= 768 && !menuPanel.hidden) setMenu(false);
  });

  /* ---------- Navbar shadow on scroll ---------- */
  var nav = document.getElementById('navbar');
  function onScroll() {
    var scrolled = window.scrollY > 20;
    nav.classList.toggle('shadow-sm', scrolled);
    nav.classList.toggle('bg-nude-100/95', scrolled);
    nav.classList.toggle('border-burgundy-800/10', scrolled);
    nav.classList.toggle('border-transparent', !scrolled);
  }
  var waFloat = document.getElementById('waFloat');
  function toggleFloat() {
    waFloat.classList.toggle('is-shown', window.scrollY > 520);
  }
  var onScrollAll = function () { onScroll(); toggleFloat(); };
  onScrollAll();
  window.addEventListener('scroll', onScrollAll, { passive: true });

  /* ---------- Motion ---------- */
  var hasGSAP = !!(window.gsap && window.ScrollTrigger);

  if (reduceMotion || !hasGSAP) {
    // Fallback: CSS transitions driven by IntersectionObserver
    var els = document.querySelectorAll('.reveal-element');
    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in-view'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { entry.target.classList.add('in-view'); io.unobserve(entry.target); }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
      els.forEach(function (el) { io.observe(el); });
    }
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add('gsap-ready');

  /* Scroll reveal, batched with stagger */
  ScrollTrigger.batch('.reveal-element', {
    start: 'top 88%',
    once: true,
    onEnter: function (batch) {
      gsap.to(batch, {
        opacity: 1, y: 0, filter: 'blur(0px)',
        duration: 1, ease: 'expo.out', stagger: 0.09, overwrite: true
      });
    }
  });

  /* Parallax on ambient layers */
  gsap.utils.toArray('[data-parallax]').forEach(function (layer) {
    gsap.to(layer, {
      yPercent: parseFloat(layer.dataset.parallax) * 100,
      ease: 'none',
      scrollTrigger: { trigger: layer.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  /* Count-up on the real numbers */
  gsap.utils.toArray('.count').forEach(function (el) {
    var target = parseFloat(el.dataset.count);
    var obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: 'top 90%', once: true,
      onEnter: function () {
        gsap.to(obj, {
          v: target, duration: 1.4, ease: 'power2.out',
          onUpdate: function () { el.textContent = Math.round(obj.v); }
        });
      }
    });
  });

  /* Hero arch settles in */
  gsap.from('header .aspect-\\[4\\/5\\]', { scale: 0.94, opacity: 0, duration: 1.3, ease: 'expo.out', delay: 0.25 });
})();
