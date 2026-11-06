# Combined site — integration and update notes (2026-11-07)

## Sources
- VS AI: `Grandis_Legacy_VS_AI_Season0_v1.0_RC31_2026-11-07.zip` (RC31)
- Deck Builder: `Grandis_Legacy_Deck_Builder_v1.61_2026-11-07.zip` (v1.61)
- Previous approved navigation: `Grandis_Legacy_VS_AI_RC30_Deck_Builder_v1.60_Direct_GitHub_Pages_Ready_2026-11-06.zip`

## Packaging
- Root: **copy** VS AI `index.html`, `assets`, `card-art`, `engine`, `runtime`, `shared-app`, `shared-ui`.
- `deck-builder/`: **copy** Deck Builder `index.html`, `assets`, `css`, `data`, `js`, `style-1`, `style-2`.
- Keep the exact new source runtime logic and styling, except for the intentional, isolated navigation edits below.
- `CNAME` and `.nojekyll` at root only. Keep integration, upload and QA notes under `docs/` (no scripts or tools in repository root).

## Authorized integration edits
1. VS AI RC31 `index.html`: include `assets/css/site-integration.css` and `assets/css/site-artwork-loading.css` after `shared-ui/battlefield-ui.css`. Keep RC31's favicon reference to `engine/assets/favicon.png`.
2. VS AI RC31 `shared-app/app-runtime.js`: make Lobby logo a root link; show `GO TO DECK BUILDER` linking `deck-builder/`; retain PvP link hidden with `data-app-unavailable`. Do not overwrite RC31's **Match Result** behavior.
3. Deck Builder v1.61 `index.html` and `style-2/index.html`: logo links `../` and `../../` respectively; enable desktop/mobile app navigation; VS AI links root; PvP links retained hidden. Style switch remains app-local. Preserve v1.61 script/cache CSS query parameters and mobile chevron image controls.
4. Static navigation CSS lives in `assets/css/site-integration.css`; no game engine or card/data authority files edited.
5. The two source favicon PNG files have matching SHA-256 (see QA).
6. Previously approved card artwork loading fix is now included **without increasing either application version**: bounded player Hand artwork preloads, card-back placeholder while the front image loads/decodes, and opacity fade when ready. VS AI `shared-app/app-runtime.js` is the only runtime JS edited; CSS isolated in `assets/css/site-artwork-loading.css`. Opening Hand + later Draws covered; gameplay/Draw rules unchanged.

## Safe future updates
- When VS AI upgrades RC31→RC32, update only its root runtime directories and root `index.html`, reapplying navigation, artwork-loading CSS inclusion, and the Hand-art preload/placeholder hook (unless upstream already contains an equivalent tested fix). Don't replace `deck-builder/`.
- When DB upgrades v1.61→v1.62, update only `deck-builder/` runtime folders, reapply root/logo/nav links to both styles; keep current version-specific code unchanged. Don't replace VS AI runtime.
- A future Main Website can take `/`; then move VS AI to `/vs-ai/` and revalidate relative asset paths/links. Don't move files until that site exists.
- PvP is absent/hidden; do not unhide until its frontend+backend have been integrated and verified.

## QA scope
- JS syntax and HTTP requests to checked local pages/assets: results in `QA_INTEGRATION_2026-11-07.md`.
- Full natural game, Deck Builder JSON import into VS AI and hosted deployment require browser/live verification.
- The prior Opening Hand artwork task is **included** in this same-version GitHub-ready package as a targeted Hand presentation patch. See `QA_ARTWORK_LOADING_FIX_2026-11-07.md`. Full live Match QA is still not verified.

## Root-clean packaging (same RC31 + v1.61)
- Root essentials only: `index.html`, `CNAME`, `.nojekyll`, `README.md`.
- Integration stylesheets moved into `assets/css/`; the loading CSS card-back background reference adjusted to `../ui/back-main.webp`.
- Integration, QA and GitHub upload notes moved to `docs/`. No application runtime JavaScript or Deck Builder files changed.
