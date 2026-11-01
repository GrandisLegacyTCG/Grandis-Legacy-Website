# Grandis Legacy Deck Builder v1.32.2 — Validation Report

**Release status:** Season 0 Beta. Original Style 1 and Style 2 are retained, with targeted changes only. OSA v1.9.19 is unchanged.

## Changes checked

1. Both styles use extra CSS (the original Style 1 and Style 2 source CSS hashes remain unchanged) to reflow all popups; only vertical scroll is needed where content exceeds viewport height.
2. Style 2 hover anchors use the opposite panel's boundary for the X coordinate; the source panel is not occluded, and the Y coordinate follows the hovered tile (clamped to fit the viewport).
3. Both styles populate a Keyword dropdown from the S0 metadata and apply the keyword filter alongside existing filters.
4. Both styles can import an archived S1 deck, match named main cards, keep quantities and over-50 drafts, and report unmapped Hero/Legacy/Main cards before confirmation. Skipped or ambiguous names are not mapped speculatively.

## Automated checks

- `npm run check`: **15/15 assertions** (9 base Season 0 / unchanged CSS / artwork / authority checks and 6 S1 migration checks). PASS.
- `npm run check:browser:s0`: **PASS**. Live Chromium DOM/script/CSS interaction on both styles, including Keyword DODGE filtering; real historical Season 1 starter file imported as **58/60** (2 unmatched) into both interfaces, preserving all 58 entries and showing invalid >50 state; popups checked at **1423×745, 900×520, and 390×700**; Style 2 hover alignment measured at subpixel accuracy and two directions. Zero JavaScript page errors.
- Synthetic/historical main-deck migration: 60 → **52** when eight copies fail to match; every unmatched copy is reported. Other tests cover ambiguous/renamed cards being skipped, source unchanged, name-only import, and hybrid Hero ID remapping.
- Existing 204 S0 artworks SHA-256 checked by the base S0 test; their card records remain unchanged.

## Limitations

- Because the QA environment blocks direct Chromium navigation to `file://` and `http://127.0.0.1`, browser verification is performed by injecting the *actual* HTML, source CSS, data and JS into Chromium. Validate after extracting/opening the ZIP on your browser, especially local-save state and physical file-picker behavior.
- This release is not the completed gameplay integration: only deck construction is available.
- Imported drafts above 50 or exceeding a per-card copy limit remain visibly **invalid**; users must adjust them manually. The old imported JSON remains unchanged.
