# Grandis Legacy Deck Builder v1.33.1 — Update5 / NO STARTERS

- Baseline: physically available Deck Builder v1.32.6; **NOT** a verified upgrade of previously discussed v1.32.8.
- Two original styles preserved. Season 0 catalog: 242 unique cards (187 Main Skill/Item/Event + 45 Hero + 10 Legacy).
- Added 24 user-supplied Skill Card WEBP artworks, updated Ice Block artwork/text, and Melody Rank III Maestro artwork/class name. Melody/Bromir class abilities remain DRAFT and are not implemented.
- Starter Deck presets and archived active starter lists are not shipped in this no-starter release. Blank deck/import flows remain. Nothing has been declared FINAL.
- Printed text is transcription of user artwork. **Resonance Burst and other wording changes have NOT been invented or painted into card images.** See wording review for proposed copy.
- This is a deck-construction/browser deliverable, NOT a gameplay-engine implementation. Old VS AI/PvP and OSA are separate.
- Test: `npm run check`, optional browser `npm run check:browser:s0` (some old tests carry 218-card assumptions and are excluded from updated check script).
- To open: run local HTTP server `python3 -m http.server 8000`, open root `index.html` or `style-2/index.html`.

## v1.33.1 — Style 2 artwork path correction

- Fixed the S0 data art URL resolver for the Style 2 subfolder. Existing legacy/old Season 0 records used unprefixed `assets/season0/cards/...` paths that resolved to nonexistent `style-2/assets/...`; Update5 cards used a separate `{S0_IMAGE_BASE}` placeholder.
- Both image path formats now resolve consistently for Style 1 and Style 2. Card artwork bytes, card text, Hero abilities, deck rules, and absence of starter presets are unchanged.
- `node tests/run-style2-images.cjs` asserts that all 242 S0 card images and progression cover images resolve to existing files from both style entrypoints. This closes the image-url coverage gap in v1.33.0's browser smoke test.
