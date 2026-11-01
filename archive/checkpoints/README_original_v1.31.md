# Grandis Legacy Deck Builder — Season 0 R2 — v1.32.6

## How to launch on Windows

**Extract the ENTIRE ZIP first.** Then double-click:

- **Style 1:** `style-1/index.html` (or root `index.html`)
- **Style 2:** `style-2/index.html`

Use `CHANGE TO STYLE 1 / STYLE 2` inside the app to switch directly to the other HTML file. **Do not navigate to the `style-2/` directory URL** or open a folder in Firefox, which displays a folder listing instead of an application. Do not copy the HTML files outside the extracted folder; they use shared `assets/`, `js/`, `css/`, and `data/`.

## This fix release

1. Artwork: corrected the generated `{S0_IMAGE_BASE}` token in Season 0 card and cover image URLs. All **218** WEBP artworks from OSA v1.9.21 R2 remain unchanged and present.
2. Navigation: switches point directly to `index.html` on the opposite style; Style 1's previously stale nested HTML now matches the current Season 0 application.
3. Hero selection: Melody Silverstring and Bromir Oathforge are hidden/unselectable because their Rank II/III Skills and Ultimates are pending. The source catalog still contains all 15 Hero progressions and 45 Hero Card records; **13 are selectable** for deck construction.
4. Folder structure: prior QA files and source snapshots moved to `archive/checkpoints/`. No historical file was discarded.

Core original v1.31 CSS is unmodified for both styles. Card metadata/effects and OSA stay at v1.9.21, Rulebook stays v2.7.2. Deck Builder is still Season 0 beta. `npm run check` runs current automated checks.

See `README_S0.md` for existing gameplay/deck-builder features and `archive/checkpoints/` for older reports.
