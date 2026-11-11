/* Grandis Legacy Season 0: shared artwork fallback for player-facing cards. */
(() => {
  'use strict';
  const script=document.currentScript;
  if (!script || !script.src) return;
  const assetBase=script.src;
  const backs={
    main:new URL('../ui/back-main.webp',assetBase).href,
    legacy:new URL('../ui/back-legacy.webp',assetBase).href,
    shard:new URL('../ui/back-shard.webp',assetBase).href
  };
  const cardPath=/(?:^|\/)(?:card-art|cards)\/S0-[A-Z0-9-]+\.webp(?:[?#]|$)/i;
  document.addEventListener('error',(event) => {
    const img=event.target;
    if (!(img instanceof HTMLImageElement)) return;
    if (img.dataset.glArtworkFallback==='1') return;
    // Player Hand has a dedicated decode-aware fallback in RC38.
    if (img.closest('.hand.bottom .hand-card')) return;
    const src=img.getAttribute('src') || '';
    if (!cardPath.test(src)) return;
    const name=src.split('/').pop().split(/[?#]/)[0];
    const target=/-MAN-/.test(name)?backs.shard:/-(?:H|L)\d+\.webp$/i.test(name)?backs.legacy:backs.main;
    img.dataset.glArtworkFallback='1';
    img.src=target;
  },true);
})();
