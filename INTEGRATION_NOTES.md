# Combined site — integration and update notes (2026-11-07)

## Sources
- VS AI: `Grandis_Legacy_VS_AI_Season0_v1.0_RC31_2026-11-07.zip` (RC31)
- Deck Builder: `Grandis_Legacy_Deck_Builder_v1.61_2026-11-07.zip` (v1.61)
- Previous approved navigation: `Grandis_Legacy_VS_AI_RC30_Deck_Builder_v1.60_Direct_GitHub_Pages_Ready_2026-11-06.zip`

## Packaging
- Root: **copy** VS AI `index.html`, `assets`, `card-art`, `engine`, `runtime`, `shared-app`, `shared-ui`.
- `deck-builder/`: **copy** Deck Builder `index.html`, `assets`, `css`, `data`, `js`, `style-1`, `style-2`.
- Keep the exact new source runtime logic and styling, except for the intentional, isolated navigation edits below.
- `CNAME` and `.nojekyll` at root only. Runtime-only deployment excludes archival docs, tests, and tools.

## Authorized integration edits
1. VS AI RC31 `index.html`: include root `site-integration.css` after `shared-ui/battlefield-ui.css`. Keep RC31's favicon reference to `engine/assets/favicon.png`.
2. VS AI RC31 `shared-app/app-runtime.js`: make Lobby logo a root link; show `GO TO DECK BUILDER` linking `deck-builder/`; retain PvP link hidden with `data-app-unavailable`. Do not overwrite RC31's **Match Result** behavior.
3. Deck Builder v1.61 `index.html` and `style-2/index.html`: logo links `../` and `../../` respectively; enable desktop/mobile app navigation; VS AI links root; PvP links retained hidden. Style switch remains app-local. Preserve v1.61 script/cache CSS query parameters and mobile chevron image controls.
4. Static navigation CSS lives in root `site-integration.css`; no game engine or card/data authority files edited.
5. The two source favicon PNG files have matching SHA-256 (see QA).

## Safe future updates
- When VS AI upgrades RC31→RC32, update only its root runtime directories and root `index.html`, reapplying navigation CSS inclusion + lobby links to the NEW version. Don't replace `deck-builder/`.
- When DB upgrades v1.61→v1.62, update only `deck-builder/` runtime folders, reapply root/logo/nav links to both styles; keep current version-specific code unchanged. Don't replace VS AI runtime.
- A future Main Website can take `/`; then move VS AI to `/vs-ai/` and revalidate relative asset paths/links. Don't move files until that site exists.
- PvP is absent/hidden; do not unhide until its frontend+backend have been integrated and verified.

## QA scope
- JS syntax and HTTP requests to checked local pages/assets: results in `QA_INTEGRATION_2026-11-07.md`.
- Full natural game, Deck Builder JSON import into VS AI and hosted deployment require browser/live verification.
- Previous user-approved Opening Hand card-back placeholder/preload idea is **not included**: this update intentionally merges the released standalone sources and navigation without changing hand rendering/gameplay UI. It should be implemented and QA'd as a separately scoped VS AI update to avoid accidentally overwriting RC31 improvements.
