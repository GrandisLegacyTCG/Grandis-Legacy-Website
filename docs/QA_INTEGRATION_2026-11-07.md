# Grandis Legacy RC31 + Deck Builder v1.61 — Integration QA

**Date:** 2026-11-07 | **Status:** Static integration verified, card Hand artwork safeguard added and isolated browser DOM-tested; full hosted game not verified.

## Source baselines
- VS AI Season 0 **v1.0 RC31**, NOT RC30/29. RC31's Surrender → Match Result and explicit Back to Lobby behavior are preserved.
- Deck Builder **v1.61**, NOT v1.60. v1.61 mobile Card Library/Main Deck chevron PNG behavior and script version parameters are preserved.
- Original `grandislegacytcg.github.io` website/PvP were not merged and were not modified.

## Results
- **PASS**: repo-root `index.html`, `CNAME`, `.nojekyll` and two DB style entries present.
- **PASS**: unchanged VS AI assets/runtime match source RC31; `shared-app/app-runtime.js` is intentionally patched for Hand artwork preload + fallback (so its SHA-256 differs from original RC31).
- **PASS**: exact SHA-256 match for 345 untouched Deck Builder runtime/asset files against v1.61.
- **PASS**: 99 static references in three top-level HTML entry points resolve to bundled files.
- **PASS**: all 40 distributed `.js` files accepted by Node.js syntax check.
- **PASS**: 28 CSS `url()` reference paths checked. Two unresolved paths are inherited *unchanged* from original RC31 in `assets/review-db158/css/app.css` (`../assets/ui/Grandis-Background.webp`, `../assets/ui/chevron-down.png`). Because the assets are missing in the original RC31 too, no speculative fix is included; live review-card rendering is NOT VERIFIED.
- **PASS**: native RC31 favicon `engine/assets/favicon.png` and DB v1.61 `assets/favicon.png` are byte-identical, SHA-256 `ba3c77d7c9172a375ad23fb449ad44a1ff4d7dad53a56770f71e352cbc7cb03d`.
- **PASS**: navigation link/hidden-PvP assertions on root, Style 1, Style 2; special checks for RC31 Match Result functions and DB v1.61 chevron markup.
- **PASS**: HTTP GET for all 18 tested local pages/images/styles/scripts returned 200.
- **BLOCKED**: six attempted interactive Chromium navigations at 1440×900 and 390×844, all `ERR_BLOCKED_BY_ADMINISTRATOR` (environment restriction). This does *not* mean the site itself failed.
- **NOT VERIFIED**: live GitHub Pages/custom domain deployment, visual navigation and style across devices, full Human-vs-AI match, live Opening Hand workflow, and actual Deck Builder v1.61 exported JSON import into VS AI RC31. The artwork placeholder/decode behavior is separately tested with an isolated Chromium DOM, not a complete match.

## Scope and follow-up
This package keeps the existing RC31 and v1.61 labels. It adds the previously approved artwork loading improvement in VS AI player Hand rendering only. No engine, data, AI logic, artwork files, or v1.61 collapse behavior was changed. See `QA_ARTWORK_LOADING_FIX_2026-11-07.md` for exact change scope and isolated test evidence. Full end-to-end gameplay remains NOT VERIFIED.

## Packaging-only update — root clean
The root contains only the entry point, Pages configuration, and README. Site integration CSS is in `assets/css/`, documentation in `docs/`. `index.html` links and the card-back stylesheet relative URL were updated to preserve behavior. No game engine, Deck Builder, artwork, or runtime JavaScript was changed. Functional end-to-end QA remains NOT VERIFIED.
