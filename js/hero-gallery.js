// Hero gallery: pick one real photo per service at random on every load, then
// preload the exact file chosen (avoids fetching one we won't use).
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
  function pick(name) {
    var pool = HERO_POOLS[name];
    return pool[Math.floor(Math.random() * pool.length)];
  }
  window.__hero = { brows: pick('brows'), massage: pick('massage'), micro: pick('micro') };
  document.write('<link rel="preload" as="image" href="assets/images/' + window.__hero.brows.base + '.webp" type="image/webp" fetchpriority="high">');
})();
