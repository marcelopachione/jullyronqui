// Hero gallery: pick one real photo per service at random on every load, then
// preload the exact file chosen (avoids fetching one we won't use).
// On mobile only one of the three service figures is shown, also chosen at
// random per load, so the arch gallery doesn't stack three tall portraits.
(function () {
  var HERO_POOLS = {
    brows: [
      { base: 'brows', alt: 'Eyebrow design being shaped with tweezers during a brow appointment' },
      { base: 'brows-2', alt: 'Eyebrow tweezing in progress, shaping the arch with precision' },
      { base: 'brows-3', alt: 'Eyelash extensions being carefully removed with fine tweezers' },
      { base: 'brows-4', alt: 'Close-up of brow tweezing along the natural arch' },
      { base: 'brows-5', alt: 'Lash tint being applied with a mascara wand for a fuller look' }
    ],
    massage: [
      { base: 'massage', alt: 'Relaxing back massage in a warmly lit treatment room' }
    ],
    micro: [
      { base: 'micropigmentation', alt: 'Eyebrow micropigmentation being applied with a precision pen' }
    ]
  };
  var HERO_KEYS = ['brows', 'massage', 'micro'];
  // Mobile's single hero pick only draws from bookable services (brows,
  // massage) — micro is "Coming soon", so it must never be the one image a
  // mobile visitor sees first.
  var HERO_MOBILE_POOL_SIZE = 2;
  function pick(name) {
    var pool = HERO_POOLS[name];
    return pool[Math.floor(Math.random() * pool.length)];
  }
  window.__hero = { brows: pick('brows'), massage: pick('massage'), micro: pick('micro') };

  var isMobile = window.innerWidth < 640;
  var mobilePick = Math.floor(Math.random() * HERO_MOBILE_POOL_SIZE);
  window.__heroMobilePick = mobilePick;
  document.documentElement.classList.add('hero-pick-' + mobilePick);

  var preloadKey = isMobile ? HERO_KEYS[mobilePick] : 'brows';
  document.write('<link rel="preload" as="image" href="assets/images/' + window.__hero[preloadKey].base + '.webp" type="image/webp" fetchpriority="high">');

  // Called from each hero <figure>'s inline script to write its <source>/<img>.
  // Skips the write entirely for figures the mobile layout hides (CSS keeps
  // only one visible below 640px), so their images are never fetched there.
  window.__heroWriteImg = function (idx, key) {
    var mobile = window.innerWidth < 640;
    if (mobile && mobilePick !== idx) return;
    var data = window.__hero[key];
    var isPriority = mobile ? true : idx === 0;
    var loadAttr = isPriority ? 'fetchpriority="high"' : 'loading="lazy"';
    document.write('<source srcset="assets/images/' + data.base + '.webp" type="image/webp"><img src="assets/images/' + data.base + '.jpg" width="720" height="900" ' + loadAttr + ' decoding="async" alt="' + data.alt + '" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">');
  };
})();
