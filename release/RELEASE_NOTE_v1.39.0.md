# Grandis Legacy Deck Builder v1.39.0 — Card Review Corrections

29 October 2026. Baseline: v1.38.0, all Season 0 assets unchanged.

## Changed

1. Fixed black padding/backdrop behind the artwork in Card Review by making the artwork column, canvas and layout background transparent. The card sits on the same #242630 review modal surface.
2. Moved printed CONDITION outside all Rank/Skill Effect boxes into a single independent panel **above** the Rank/Effect boxes. The number of CONDITION entries is based on the physical card, not on the number of metadata rows. On R3.4, all 13 known CONDITION cards print one condition. Permafrost metadata includes a duplicated condition in its two Rank rows; it is displayed once. Rank damage 80/100 remains visible after separating CONDITION.
3. Updated REFLECT definition from the *newer* uploaded Player Rulebook v2.7.8 EN (28 Oct 2026) page 12 to exactly: "When this Hero is attacked, deal damage to the attacker as stated on the card."

## Unchanged

- Artwork: Main Deck R3.4, Legacy R3.2; all bundled image bytes preserved.
- Shared deck state across Style 1 and Style 2, quantity buttons and hover interactions.
- 18 keyword badge artwork assets, 20px height, and Review typography scaling.
- No Starter Deck.

## QA

- Focused Chromium DOM tests on Style 1/2 for 13 CONDITION cards, including single CONDITION on Resonance Burst and Permafrost, separated review panel, full Rank effect rows and updated REFLECT definition: PASS.
- Existing v1.38 browser checks re-executed: PASS.
- Existing npm tests: all logged stages PASS on the latest run; process-level completion was interrupted by execution environment timeout after the final PASS output. Check the accompanying QA report for precise scope.
