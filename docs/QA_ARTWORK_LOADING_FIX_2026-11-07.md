# Card Artwork Loading Fix — same versions (7 November 2026)

## Baseline and scope
- Input: `Grandis_Legacy_VS_AI_RC31_Deck_Builder_v1.61_Direct_GitHub_Pages_Ready_2026-11-07.zip`.
- Version labels **unchanged**: VS AI Season 0 RC31 + Deck Builder v1.61.
- Fix requested: on an opening draw, Hand cards used to show their alt-text briefly before artwork loaded.
- No changes to gameplay, Draw count/timing, cards, AI, game engine, Deck Builder or navigation.

## Changes
1. `shared-app/app-runtime.js`: preload actual player Opening Hand artworks after opening setup is committed, without blocking the existing animation; prefetch later committed Draw and reserved Draw artworks as soon as their IDs become known; use a bounded prefetch cache (max 16 image objects).
2. In the player Hand renderer only, keep front artwork invisible until the image has loaded and decoded. The existing card-back image is displayed underneath. On successful decode, front fades in. On image error, the back remains and broken-image alt text is not shown.
3. `assets/css/site-artwork-loading.css`: isolated Hand-only placeholder/fade styling. `index.html`: includes this CSS.
4. Integration documentation and QA updated to record the patch (future standalone upgrades must retain/reapply it).

## Verification
- **PASS**: JavaScript parser syntax for all 40 packaged JS files (`node --check`).
- **PASS**: isolated actual Chromium DOM test with 550ms delayed card art: opaque card-back placeholder visible and image opacity `0` before load; front image visible with opacity `1` after load.
- **PASS**: isolated Chromium DOM test with HTTP 404 art: fallback remains a card back, not broken-image alt-text.
- **PASS**: bounded preload cache never retains more than 16 Image objects in simulated multi-draw.
- **PASS**: code inspection confirmed opening, committed later Draw, and reserved Draw preload call sites.
- **PASS**: expected GitHub Pages root, Deck Builder routes and fallback asset exist.
- **BLOCKED**: full-site Chromium navigation in the environment returned `ERR_BLOCKED_BY_ADMINISTRATOR`; isolated DOM tests could still run.
- **NOT VERIFIED**: real Opening Hand end-to-end gameplay on deployed GitHub Pages, full match, cross-browser behavior and live network timing. Browser app and live gameplay smoke test recommended after upload.

## Deployment status
- Package is ready for GitHub Pages branch-root upload. Not pushed or deployed. Source baseline ZIP was not overwritten.
