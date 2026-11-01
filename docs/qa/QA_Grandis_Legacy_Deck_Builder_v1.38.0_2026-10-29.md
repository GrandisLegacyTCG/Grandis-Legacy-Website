# Grandis Legacy Deck Builder v1.38.0 — QA and Release Report

**Date:** 29 October 2026 (Asia/Jakarta)  
**Baseline:** v1.37.0 R3.4 No Starters  
**Status:** Scoped application QA PASS (offline Chromium). Live hosted integration NOT verified.

## Changes made

1. **Card Review keyword badges:** Both inline Skill Effect and separate Keyword Explanation use the same actual 20px rendered image height, with intrinsic aspect ratio. No redesign of the user's 18 keyword images. ALL ALLIES remains absent. The explanation appears once, below Rank sections and before Ultimate Rules when present.
2. **Card Review typography:** Gold section labels (e.g., MANA COST, TYPE, EXP TRIBUTE, CLASS, RANK, SKILL EFFECT, KEYWORD EXPLANATION, ULTIMATE RULES) render at **14px**, while white body/value text renders at **12px** (2px smaller). The card title is intentionally larger for visual hierarchy. Applied to both Style 1 and Style 2.
3. **Style 2 hover preview:** The Card Library hover still shows its large preview on the **right**; cards inside Main Deck now show a preview on the **left**, using the same existing zoom renderer. Clicking a Main Deck card still opens Card Review, and -/+ controls do not trigger Card Review.
4. **Clean package root:** Historical repeated versioned README, QA and superseded authority files were moved without deletion to **`archive/historical-root-docs/`**. Only active files are kept at the top level (`index.html`, `README.md`, `package.json`, `SOURCE_LOCK_v3.20.json`, `.nojekyll`, `FILE_MANIFEST_SHA256.csv`). Original v1.37 README is also preserved in that historical folder.
5. **No gameplay/card balance changes.** All artwork files remain byte-identical to v1.37. OSA was not modified. Cross-style shared deck remains the v1.37 architecture.

## Test evidence

| Test or check | Result |
|---|---|
| `npm test` (active v1.38 suite, including all in-package browser suites) | **PASS**, exit 0 |
| v1.38 Chromium review badge height | **PASS**, all 5 badges on Absolute Defense render at 20px in both styles |
| v1.38 Chromium labels and body sizes | **PASS**, tested gold 14px vs white 12px for multiple sections in both styles |
| v1.38 Chromium hover interaction | **PASS**, Card Library zoom right and Main Deck zoom left; click Review and quantity isolated |
| v1.37 DB-11 roundtrip shared state | **PASS**, Style 2 → Style 1 → Style 2 → Style 1, deck edits preserved |
| v1.36 scoped keyword/scroll and quantity regressions | **PASS** with latest intended hover behavior |
| Static source/card audit | **PASS**, 187 Main + 45 Hero + 10 Legacy = 242 valid artwork records |
| No Starter Deck presets | **PASS** |
| Asset conservation vs v1.37 | **PASS**, 266 files in `assets/`, 0 byte changes |
| Historical doc migration | **PASS**, 12 preserved historical docs + folder index, 6 active root files |

**Historical-only suite caveat:** `npm run check:regression` is an old v1.31 archival script and fails its hard-coded `package version must be 1.31.0` assertion when run with current v1.38. This mismatch is **not** considered a pass and is not silently excluded from the report. Current active `npm test` passes. The historical suite is retained under the normal `tests/` path for future migration if desired.

**Browser verification caveat:** Chromium tests load HTML/CSS/JS into an isolated document with an in-memory storage shim. These do not certify hosting, a real production domain, browser-cache behavior, or user authentication.

## Package integrity

`npm run manifest` and `node tests/run-manifest-verification.cjs` were used before packaging. The final ZIP will be re-extracted and the active test suite re-run. Full ZIP SHA256 is given separately next to the download.
