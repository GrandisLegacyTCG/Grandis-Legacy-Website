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

