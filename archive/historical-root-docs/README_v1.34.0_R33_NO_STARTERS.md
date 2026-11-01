# Grandis Legacy Deck Builder v1.34.0 — Season 0 R3.3 (No Starters)

## Scope

- **Deck builder only**; no modifications to OSA runtime, PvP, or VS AI.
- Based on Player Rulebook **v2.7.8 EN** for deck-construction rules and **Main Deck R3.3** for 187 card artwork and printed display.
- Overrides **S0-MAG-028 Provoke** with the user-supplied Arcane Warrior Rank II artwork.
- Uses **Legacy Deck R3.2** 55 Hero/Legacy artwork assets. Mana Deck R1 remains the deck-construction assumption (12 physical Mana).
- Two original UIs remain: `index.html` (Style 1) and `style-2/index.html` (Style 2).
- **No Starter Decks**, by request. Blank deck and JSON export/import remain.

## Keyword filters

- **MANA BURN:** S0-MAG-020, S0-MAG-022, S0-MAG-023, S0-MAG-024, S0-MAG-026, S0-MAG-028.
- **MANA STEAL:** S0-MAG-021, S0-THF-005.
- Both keywords are available in **Style 1 and Style 2** Keyword filters. All pre-existing keyword options remain.
- `S0-THF-005 Steal` is displayed as `MANA STEAL 1.` per its actual R3.3 image, correcting stale text in the OSA R3.3 JSON snapshot.

## Source handling

- `js/season0-catalog.js` stores updated card eligibility, classification, keyword tags and hashes.
- `js/data-s0.js` stores printed text, labels, cost, image paths, and filters for both UI styles.
- `data/source-snapshots/main-deck-r3.3-v5.86-print.json` includes the exact snapshot used to sync 187 cards, with documented Steal and Provoke overrides.
- Printed display sync is **not** an engine implementation or certification. OSA final certification remains pending.
- Existing draft hero Class Ability notes and historical source tests are preserved; no gameplay mechanics are introduced here.
- Browser/system sans-serif font fallback is used; no font files are redistributed.

## Run & test

1. Extract ZIP and open `index.html` or `style-2/index.html`, or host the folder as a static site.
2. For local HTTP: `python3 -m http.server 8000` then open `http://localhost:8000/`.
3. For tests: `npm run check` (R3.3 card/art/keyword checks and both UI artwork paths).
4. Legacy Update5 tests are historical and may fail against the intentional R3.3/Provoke changes; they are not the current release gate.

There is **no starter preset** in this release.
