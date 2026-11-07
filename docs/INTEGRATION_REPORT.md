# Integration and QA — 7 November 2026

## Baseline / Authorized Scope
- New standalone: **VS AI Season 0 v1.0 RC32**, `Grandis_Legacy_VS_AI_Season0_v1.0_RC32_2026-11-07.zip` (latest uploaded RC32).
- New standalone: **Deck Builder v1.62**, `Grandis_Legacy_Deck_Builder_v1.62_2026-11-07.zip`.
- Previous integrated reference: VS AI RC31 + DB v1.61 Root Clean, November 7, including the prior approved Hand artwork placeholder fix.
- Authorized changes: create direct GitHub Pages package, preserve logo/nav & hidden PvP, preserve artwork fix, root clean, no app version bump.
- PvP and main website are **excluded**. No remote repository, DNS or live website modified.

## Implementation
1. The **new** RC32 runtime/assets and **new** Deck Builder v1.62 deployable assets were copied directly. No previous gameplay engine or card database was used.
2. RC32 Lobby integration: clickable Grandis Legacy logo to `/` (relative `./`), Deck Builder link to `deck-builder/`, future PvP link retained **hidden**.
3. Both Deck Builder styles: logo and `GO TO VS AI` point to relative domain root; PvP remains hidden in desktop/mobile nav. Style-switch routes unchanged.
4. Preload & Card-Back safeguard from earlier accepted fix was re-applied to **RC32's own** `shared-app/app-runtime.js`: opening hand, committed later draws, reserved draws. Images are hidden until loaded/decoded; previous actual card back is shown underneath. Only UI presentation code touched.
5. `assets/css/site-integration.css` and `assets/css/site-artwork-loading.css` imported from previous integration. Index references updated; favicon bytes verified equal to updated Deck Builder's favicon.
6. Deployable static files copied only; VS AI historical `docs/`, Deck Builder `archive/`, historical `release/`, `tests/`, `tools/` and dev-only metadata were excluded from Pages snapshot. Original latest standalone README files preserved under `docs/` for provenance. No application data/source needed by the live HTML removed.

## Validation results (scope strictly limited)
- ZIP source integrity: **PASS** (both standalone inputs readable without error).
- Direct Pages root clean: **PASS**, root files are `.nojekyll`, `CNAME`, `index.html`, `README.md`.
- New-source SHA/byte parity: **PASS** — 751 runtime/data/asset files identical to latest source; only approved app-runtime/index/nav sites patched.
- JavaScript syntax via `node --check`: **PASS**, 40 files.
- JSON syntax: **PASS**, 32 files.
- HTML local references: **PASS**, 100 references in 4 HTML files.
- HTTP local URLs: **PASS**, 13 requests; this proves local delivery only, not browser gameplay.
- CSS URL inspection: **29 references checked**; **2 pre-existing references missing** in untouched `assets/review-db158/css/app.css` (`../assets/ui/Grandis-Background.webp`, `../assets/ui/chevron-down.png`). Both appear inherited from the newer standalone source as written. Not silently patched; the live site might or might not use them.
- Navigation markup/fallback asset/future-PvP hidden/static artwork call sites: **PASS** by source inspection.
- Chromium full-site browser test: **BLOCKED**, local navigation returned `net::ERR_BLOCKED_BY_ADMINISTRATOR` for all 3 pages. Do **not** call this a browser PASS.
- Full gameplay, long match, import/export E2E, deployed browser/Firefox/real-network artwork delay: **NOT VERIFIED**.

## Deploy note
Direct GitHub Pages: repository `main` branch at `/(root)` with `CNAME=grandislegacytcg.web.id`. Back up existing repo; fully synchronize the contents, including deleting obsolete files from previous versions, before pushing. Old GitHub Pages domain/repository should not be changed.
