# Grandis Legacy — Season 0 VS AI RC39 + Deck Builder v1.65

Runtime-only, *full repository root* deployment. Source inputs: **VS AI Season 0 RC39 (12 Nov 2026)**, **Deck Builder v1.65 (12 Nov 2026)**, artwork **Main Deck R3.7** / **Hero & Legacy R3.6**, **Player Rulebook v3.2**. This build reuses the layout/nav and shared-artwork approach from the 12 Nov RC38+v1.64 audited package. The latest RC39 donor also includes the Intermediate Aura Combo Guard hotfix (for all Intermediate decks), keeping real Main Deck Draw supports in reserve and prioritizing completion of an already Casting Aura within a feasible 1–2-turn plan. The previous committed Mana-loss notice banner and Intermediate target-selection improvements remain intact. It does not contain older RC38 game engine code.

## Public entrypoints

- `/` — VS AI RC39.
- `/deck-builder/` — Deck Builder 1.65 Style 1.
- `/deck-builder/style-2/` — Deck Builder 1.65 Style 2.
- `/deck-builder/style-1/` — legacy Style 1 redirect.
- `/rulebook/Grandis_Legacy_Player_Rulebook_v3.2_EN_2026-11-10.pdf` — Player Rulebook.

## Manual deployment (same GitHub Pages settings, no custom build)

1. Replace the contents of repository `GrandisLegacyTCG/Grandis-Legacy-Website` with **the extracted contents of this ZIP** at repository root, not the ZIP file or an enclosing folder. If the uploader does not remove old files, delete outdated files manually (especially `deck-builder/assets/season0/cards/` and any former `.github/workflows/deploy-pages.yml`). Git tracks removed assets only when deleted.
2. GitHub **Settings → Pages**: `Deploy from a branch` → `main` → `/(root)` (same as successful S0 Pages run #22). This package does not include a `.github/workflows/` workflow or require Node/npm/build secrets.
3. Keep **`index.html`, `.nojekyll`, and `CNAME`** in root. `CNAME` must read exactly `grandislegacytcg.web.id`. Verify Pages custom-domain setting also matches.
4. Test published pages at the custom domain. If GitHub Pages reports `startup_failure` *before any job starts*, troubleshoot GitHub Pages/Actions separately; a ZIP cannot fix a GitHub-hosted startup failure.

## Artwork and cache

- Exactly **248 WebP files** at `card-art/`: 242 cards and 6 Mana. **No duplicate 242-card directory** in Deck Builder.
- RC39 and DB 1.65 image files were compared byte-for-byte: 242/242 identical. Exactly **17 Archer artwork images** changed from RC38/R3.6 to R3.7 (`001`–`013`, `015`–`018`).
- Both Deck Builder styles resolve card and catalog preview images relative to the same `card-art/` folder VS AI uses. Paths work under a custom domain or a GitHub Pages repository subpath. Card version queries are preserved from v1.65 across all three pages: 17 R3.7 Archer images have `?v=r3.7`, 31 previously refreshed R3.6 Hero images keep `?v=r3.6`, all other images retain their unversioned URLs. Browsers share the same absolute image URLs across all three applications.
- A passive artwork onerror handler shows the correct Back of Card if a physical artwork file fails. VS AI player-hand images use the previous decode-aware, Back-of-Card loading behavior, without changing the RC39 gameplay or Rank Up engine.
- No external artwork host is required; cards do not depend on the separate S1 repository.

## Scope / exclusion

Includes only active JS/CSS/HTML, necessary UI/audio/keyword assets, current starter examples, R3.7 card artwork and player rulebook. Keeps the latest RC39 Aura Combo Guard, improved Intermediate targets, committed Mana loss notices, combat, Rank Up, Mana, trial presentation and other code from the supplied RC39 source. Deck Builder retains 1.65 card data, R3.7 catalog metadata and new responsive filter styling.

Excludes QA suites, developer reports/logs, source snapshots, release manifests/history, S1 data/JS, archived duplicates, old inactive runtime CSS/JS, and inactive **PvP donor adapter** (retained in the RC39 standalone, where it is not loaded by VS AI). No PvP integration or networking changes are made.

**Final RC39 donor audit:** Latest RC39 supplied archive revised `engine/shared-app/app.bundle.js` only among active runtime files (Aura Combo Guard). This repo uses its exact new bytes, changes the HTML URL cache key, and preserves all other verified shared-artwork integrations. The RC39 archive carries developer QA evidence separately; those QA scripts are excluded from this runtime-only repository.

**Assistant does not perform GitHub uploads, commits, PRs, or settings changes.** All GitHub operations are manual by the owner.
