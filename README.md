# Grandis Legacy — Season 0 RC40 + Deck Builder v1.66 (PvP-ready navigation)

**Production static-site package, runtime only, generated 2026-11-14.** No development/QA/history files or PvP gameplay/server code are included.

## Latest verified source packages

- VS AI: `Grandis_Legacy_VS_AI_Season0_RC40_2026-11-14.zip` (RC40 Part 5, 14 November 2026).
- Deck Builder: `Grandis_Legacy_Deck_Builder_v1.66_2026-11-14.zip` (v1.66 latest UI focus/hover update).
- Artwork: **Main Deck R3.8 / Legacy Deck R3.7**, 242 card files identical byte-for-byte in RC40 and v1.66.
- Mana: 6 existing Mana art files; 248 shared WebP images total in `/card-art/`.
- Player Rulebook: unmodified `Grandis_Legacy_Player_Rulebook_v3.3_EN_2026-11-14.pdf`.

## Entry points

- `/` — VS AI RC40 lobby and game.
- `/deck-builder/` — Deck Builder v1.66 Style 1.
- `/deck-builder/style-2/` — Deck Builder v1.66 Style 2.
- `/deck-builder/style-1/` — redirect to Style 1.
- `/rulebook/Grandis_Legacy_Player_Rulebook_v3.3_EN_2026-11-14.pdf` — downloadable rulebook.
- **GO TO PVP** header button points to **https://grandislegacytcg.web.id/pvp/** from VS AI, Deck Builder Style 1 and Style 2. Mobile menus include PVP. **PvP is NOT hosted by this repository.**

## Separate PvP repository / URL routing

The target URL `https://grandislegacytcg.web.id/pvp/` is a *future entry point only*. A link does not publish or route that path automatically. The eventual separate PvP repository must be deployed and the GitHub Pages site/domain must be routed so the requested `/pvp/` path actually serves it. Do not assume a separate unrelated repo automatically appears under this domain; depending on the chosen Pages architecture, a repository named `pvp`, a user-site project path, or explicit routing/redirect rules may be needed. No `/pvp/` directory, game engine or server code is bundled here. Test the PvP URL when its own deployment is complete.

## Artwork integrity and caching

Exactly 248 WebP files are shipped in the root `card-art/` folder (242 cards + 6 Mana). Deck Builder standalone's 242 duplicates are excluded. Both Deck Builder styles resolve card and Card Review image URLs to **the same absolute URL** as VS AI under the same website base, using revision `gl-vs-ai-s0-rc40-r38-r37-20261114` to invalidate older R3.6/R3.7 images from browser cache. For every image file, copy remains pixel/byte identical to RC40. A passive Back-of-Card error fallback (and player-hand decode-aware fallback) protects against transient image failure; it cannot fix a missing deployment or broken network.

## Manual GitHub Pages deployment

1. This is a **FULL REPO**, not a patch. Replace the old published repo contents with the *contents of this ZIP at the repository root* (do not upload the ZIP as a single file, and remove stale files not in this package).
2. Keep current `GrandisLegacyTCG/Grandis-Legacy-Website` GitHub Pages settings: **Deploy from a branch → main → /(root)**. No additional Actions workflow/build step.
3. Keep `index.html`, `.nojekyll` and `CNAME` directly in root, with custom domain exactly `grandislegacytcg.web.id`. Confirm Pages site deploys successfully.
4. If Pages reports `startup_failure` before any build job starts, troubleshoot GitHub Pages/Actions configuration. Runtime file changes alone cannot resolve a GitHub-hosted workflow startup error.
5. Smoke-test VS AI, both Deck Builder styles and card images after deployment. The future PvP link will not work until the separate PvP repo/route exists.

## Integrity and scope

All RC40 core engine/data/authority/UI scripts are copied without modification, except the outer VS AI index and integration-only `shared-app/app-runtime.js` (lobby buttons and card loading). Deck Builder v1.66 behavior and card data source remain current; only index navigation and the runtime image URL resolver in `deck-builder/js/data-s0.js` are changed. All current active CSS/JS and required UI/audio, review and keyword assets are retained. No PvP gameplay/network code, QA logs, developer dumps, source snapshots or test fixtures. No GitHub operations performed by the assistant.
