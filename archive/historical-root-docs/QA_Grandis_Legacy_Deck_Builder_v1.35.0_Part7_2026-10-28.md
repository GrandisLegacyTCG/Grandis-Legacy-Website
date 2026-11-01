# Grandis Legacy Deck Builder — v1.35.0 / OSA Update Part 7 QA
**Date:** 28 October 2026  
**Decision:** Scoped release PASS on artwork, metadata integrity, filters, Card Review and offline browser; hosted navigation NOT TESTED due sandbox administrator network block.

## Inputs
- Source ZIP v1.34.0 R3.3 no starters; Main Deck R3.4 physical .RAR; Rulebook v2.7.8 EN; 55 Hero + Legacy art R3.2.
- 187 Main Card IDs and 55 Hero/Legacy Card IDs retained. All 187 R3.4 files replace the prior image assets in `assets/season0/cards`.
- Printed metadata for each card retains reviewed R3.3 baseline after verifying all 29 byte-changed R3.4 artworks visually; no newly printed gameplay diff detected. This includes the 13 changed Mage cards.

## Acceptance
| Gate | Result | Evidence |
|---|---|---|
| 187 Main IDs unique, 242 artwork files | PASS | Catalog SHA256 checker and image resolution for both styles |
| R3.4 all 187 physical artwork | PASS | Independent physical hash match to user R3.4 archive |
| 31 Mage rows vs OSA v5.86 snapshot | PASS metadata comparison | Separate Mage31 audit JSON; runtime remains scoped |
| Provoke Rank II Mana Burn 2 | PASS | 187 ID check and specific override |
| Steal Thief I Mana Steal 1 | PASS Deck Builder print | Old OSA print JSON still has legacy wording, tracked as OSA Stage1 issue |
| 2 style header parity 1440 px, 390 px | PASS geometry | Offline Chromium measured same height/width |
| Condition separate from Skill Effect | PASS sample | X Cross Slash: cost 3, condition, SURE HIT, Deal 90 Physical damage |
| Keyword Explanation directly after Effect | PASS sample | X Cross Slash, Double Casting, Mana Absorption |
| Removed ALL ALLIES | PASS | Absent from approved keyword set and filter |
| Mana Cost +1/+2 literal definitions | PASS | `js/s0-review-clarity.js` |
| Sleep and Stun only in Effect | PASS | Both styles Chromium keyword/effect UI test |
| Style 1/2 blank fresh state | PASS | All three entry points: root Style1, style-1/, style-2/ |
| No Starter Deck presets | PASS | 0 starters in data and browser |
| Host localhost browser navigation | BLOCKED | ERR_BLOCKED_BY_ADMINISTRATOR, not a site defect claim |
| All historical test suites | NOT VERIFIED | v1.32.5 ancient checks require 218 cards / old art SHA |

## Commands & results
- `npm test` (v1.35 current suite): includes `npm run check`, `npm run test:update5`, `npm run check:browser:update5` and `npm run check:browser:part7` — PASS when run on source tree and release ZIP (see QA logs).
- `npm run check`: 7/7 focused catalog tests and 242/242 image resolution for each style — PASS.
- `npm run test:update5`: 10/10 updated checks — PASS.
- `npm run check:browser:update5`: three browser routes — PASS (offline in-memory DOM harness).
- `npm run check:browser:part7`: 3/3 browser routes — PASS (offline in-memory DOM harness).
- `node tests/run-manifest-verification.cjs`: hash manifest verification — PASS when released.
- Real navigation `http://127.0.0.1:<port>/index.html` — attempted; browser blocked by sandbox administrator policy before app loaded. Recheck on deployment.

## No gameplay changes
- This v1.35 is Deck Builder only. OSA engine remains v5.86.0 NOT FINAL. No modification to game effects or balance in Deck Builder.
- Existing historical files and prior manifest provenance retained, except the `FILE_MANIFEST_SHA256.csv` which is regenerated for this package.
- The 18-card OSA Stage 1 audit is documented separately and is NOT included as a claim of OSA completion.
