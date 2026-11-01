# Deck Builder v1.32.1 — Original UI Styles Restoration QA

**Status:** Season 0 Beta — original Style 1 and Style 2 restored. No new UI layout designed.

## What changed relative to v1.32.0 Beta

- Removed the newly invented `season0/index.html` UI from the active application path. Both entrypoints are now the original v1.31 `index.html` (Style 1) and `style-2/index.html` (Style 2).
- Kept both original v1.31 CSS files **byte-for-byte identical**.
- Wired both original styles to the SAME S0 catalog/legality adapter sourced from OSA v1.9.19. Both styles accept JSON deck exports/imports and share local draft persistence under the same origin.
- Original features retained: library filters, hero progression selection, legacy slots, rank view, drag/drop, card reviews, two-way style switch, export/import.
- Replaced obsolete UI Main Deck numbers 60 → 50 and hidden retired Starter Deck menu. Legacy 12, derived Shard 12 remain validated.
- Preserved historical original data/source files in the repo; the live entrypoints do not load old S1 data.

## Verified

- `npm run check` **PASS**: 9/9 static/data/copy-limit/legality tests plus syntax checks of both active S0 styles.
- Artwork file SHA-256: **204/204 MATCH** with OSA v1.9.19 catalog. 180 Season 0 originals, 24 S1-art fallbacks.
- Both styles in headless Chromium via injection: no JS page errors; loaded 11 Hero progressions, 161 Main Card records and 43 Hero/Legacy records; selected Hero and added a Main Deck card successfully.
- Both styles with valid test deck **50 Main / 12 Legacy / 12 Shard**: OSA legality reports `ok=true`; card additions at 50 are blocked; S0 JSON export/import reconstruction passed.
- Auto-save from original Style 1 to Style 2 restore: tested using mocked shared localStorage, one Hero progression and Main Deck card persisted successfully.
- Source corrections visible: Straight Shot and Shadow Switch / 3 Mana. Special Event one-copy limit validated.
- Original CSS source SHA-256 parity with v1.31: **PASS**, both files.

## Limits / follow-up

- Standalone `file://` / real HTTP navigation to this ZIP was blocked by the test container's Chromium policy. Browser checks were performed by loading original HTML and injecting actual JavaScript/stylesheets, **not** full-page navigation smoke. The user should open both pages after extraction to verify image URLs and persistent storage in their real browser.
- S0 card Effect Recipes and gameplay integrations remain pending. 38 empty slots remain excluded. Legacy fallback art can visibly print S1 IDs even though database uses S0 IDs.
- Original v1.31 regression suite belongs to the archived S1 behavior, not the v1.32.1 S0 entrypoint; new S0 QA is exposed by `npm run check`.
- OSA checkpoint remains **v1.9.19**, and v2.0.0 was **not** promoted.
