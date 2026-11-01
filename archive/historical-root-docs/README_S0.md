## v1.34.0 — Main Deck R3.3 / Rank II Provoke / Keyword Filter

- Exact 187 Main Deck artworks from `GL_S0_MainDeck_R3.3.rar` and 55 Hero/Legacy artworks from `GL_S0_LegacyDeck_R3.2.rar`. `S0-MAG-028` artwork is overridden with the user-supplied Rank II Provoke image.
- Printed card display data synced with OSA v5.86.0 R3.3 card snapshot, with `S0-THF-005` corrected from the actual R3.3 Steal artwork (`MANA STEAL 1`). This is metadata for Deck Builder, **not** gameplay-engine integration.
- **MANA BURN** and **MANA STEAL** appear in the keyword filter for both original styles.
- Rulebook v2.7.8 baseline; 50 Main / 12 Legacy / 12 Mana deck construction validation maintained.
- Starter presets are **not included**, per the current workflow. Export/import and both original styles retained.
- To test: `npm run check`. Launch with `python3 -m http.server 8000` then open `index.html` or `style-2/index.html`.

---

# GRANDIS LEGACY — SEASON 0 DECK BUILDER (NO STARTERS)

**Update5 working build v1.33.0 (25 October 2026)**

- Two original visual styles: `index.html`/`style-1/index.html` and `style-2/index.html`.
- 242 unique artwork-backed cards: 155 Skill + 20 Item + 12 Event + 45 Hero + 10 Legacy. Main Deck library has 187 cards.
- 24 new Skill artwork files from user Update5, Ice Block revised, Melody Rank III Maestro user card update.
- 15 complete Hero progressions available; Melody/Bromir Class Ability remains draft (not implemented).
- **NO STARTER DECK PRESETS**, no final-starter claims. Create blank deck or Import JSON.
- Deck validation remains 50 Main / 12 Legacy / 12 Shards with normal copy caps and Ultimate requirements.
- Printed artwork wording stays unedited while copy is under review. See `docs/UPDATE5_WORDING_CROSSCHECK.md`.
- **Not playable/OSA complete**, not certified against forthcoming official wording.
- IMPORTANT source provenance: built from physically available v1.32.6 (not unseen v1.32.8); don't overwrite any newer Deck Builder without diffing.
- Run `npm run check` and `python tests/browser-update5-no-starters.py`.

Run locally with `python3 -m http.server 8000` from the extracted directory.
