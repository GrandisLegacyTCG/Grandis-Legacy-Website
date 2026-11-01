# GRANDIS LEGACY DECK BUILDER v1.37.0 — SHARED DECK & REVIEW PATCH

**Current release:** v1.37.0 · Main Deck R3.4 · No Starters · 29 October 2026.

- **DB-11 fixed:** one shared Season 0 workspace, not two independent decks. Style switching transfers current Main Deck quantities, Legacy slot positions (including empty slots), and deck name using an on-navigation draft fragment. This works even if local `file://` storage is isolated by page; hosted same-origin pages also synchronize through `localStorage` events (including active open tabs).
- **Card Review:** one keyword explanation panel after all Class/Rank/effect rows; for Ultimates, before Ultimate Rules. Original keyword images remain inline in effects; avoids duplicate explanations per Rank.
- **Style 2 hover:** enlarged hover on **Card Library** left is retained. Main Deck tiles use click-to-Review and ± controls without large hover popup, and their separate enlarge button remains removed.
- **Ultimate Rules copy:** fixed previously duplicated "Only Only ..." text without altering card gameplay or artwork.
- Baseline R3.4 (187 Main) and R3.2 (55 Hero/Legacy) retained with 242 artwork records. No Starter Decks, no OSA engine changes.

**QA:** `npm test` including `tests/browser-v1361-review-hover.py` and `tests/browser-v137-workspace.py`. Real hosted or `file://` full-document navigation is blocked by the test environment; the browser harness tests real style-link click/serialization and initializes opposite style from its generated URL fragment. Deployment smoke remains recommended.

See [QA_Grandis_Legacy_Deck_Builder_v1.37.0_2026-10-29.md](QA_Grandis_Legacy_Deck_Builder_v1.37.0_2026-10-29.md) for scope and evidence.

---

## Prior release notes (retained)


## Previous v1.35 notes (preserved)

# GRANDIS LEGACY DECK BUILDER v1.35.0 — OSA UPDATE PART 7

**Released:** 28 October 2026. **Baseline:** v1.34.0 with no Starter Decks.

- New Main Deck art: **R3.4**, all **187/187** physical WebP imported. Hero and Legacy art remains **R3.2 (55/55)**. Verified 242 total artwork records and hashes.
- Header of **Style 2** aligned to **Style 1**, desktop and mobile.
- Card Review: separate **CONDITION** and **SKILL EFFECT / CARD EFFECT**, with **KEYWORD EXPLANATION immediately below the effect**. Definitions use Player Rulebook v2.7.8 EN p.12, plus user-approved literal +1/+2 Mana Cost descriptions. Inline damage numbers retained (e.g. X Cross Slash 90).
- **ALL ALLIES removed**; Keyword excludes Sleep and Stun (they remain in the Effect filter); approved uppercase keyword set includes **MANA COST +1** and **MANA COST +2**; both styles share same filtering implementation.
- **Style 1 fresh-start blank**, same as Style 2. Existing saved drafts may be restored; switching style must preserve deck data.
- No Starter Deck presets. Construction rules unchanged: 50 Main / 12 Legacy / 12 Mana.
- The 31 Mage Skill cards have been crosschecked against the existing OSA v5.86 printed-data snapshot and changed R3.4 artwork. No new printed Mage gameplay differences found. This Deck Builder is not the OSA engine.

**QA:** `npm test` and `npm run check:part7` run the current v1.35 accepted suites; the old v1.32.5 suite is preserved as `npm run test:historical:v1325` and is **not current-authority compatible** (historical 218 count, older Rank I Provoke and old artwork SHA assumptions).

**Deployment:** start a static server in this directory (`python3 -m http.server 8000`) and open `index.html` or `style-2/index.html`. Real HTTP navigation may be blocked by the automated QA sandbox policy; the offline Chromium harness was run successfully.

---

## Historical release notes (kept for provenance)

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
