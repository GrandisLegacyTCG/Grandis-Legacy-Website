# Grandis Legacy Deck Builder — v1.32.6 / Season 0 R2

Original Style 1 / Style 2 retained. To run, extract ZIP, then open `style-1/index.html` or `style-2/index.html` (not a directory URL). Root `index.html` is a Style 1 equivalent.

**Catalog:** 218 artwork-backed Season 0 cards: 131 Skill, 20 Item, 12 Event, 45 Hero, 10 Legacy. 15 Hero progressions remain available as raw source metadata; 13 with an existing matching Ultimate appear in the player-facing Hero picker. **Melody Silverstring** and **Bromir Oathforge** remain hidden until their Rank II/III Skill/Ultimate packages are ready. 24 reserved Skill slots remain empty in OSA.

**User-facing features:** Season 1 deck import by name (unmatched cards skipped), 60-card draft workspace, exactly 50-card valid deck for export, 12 Legacy/12 Shards, full copies/requirements validation, Available Cards/Keyword/Effect filters, and Style 2 hover/locate behavior. Existing source R2 WEBP files are not modified.

**This release fixes:** all generated art placeholders in card & cover paths; direct Style 1 ↔ Style 2 HTML navigation; stale nested Style 1 entrypoint; clean archive for historical QA. Both styles use original v1.31 core CSS byte-for-byte.

**Authoritative reference:** OSA v1.9.21, Player Rulebook v2.7.2. No Effect Recipes or VS AI/PvP engine changes. This tool prepares decks, not a playable game engine.

**Files:** `assets/season0/cards/` has 218 R2 images, `js/data-s0.js` holds Season 0 app data, `js/season0-catalog.js` holds OSA catalog, `archive/checkpoints/` holds historical QA/version snapshots.

**QA:** `npm run check`, and optional interactive browser scripts under `tests/`. Direct `file://` navigation was blocked in automated tester; browser tests use inline DOM for functional checks. End-user Firefox direct-file check is recommended.
