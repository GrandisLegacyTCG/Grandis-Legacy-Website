# RC35.1 (internal) — Intermediate EXP Commitment / Soul Charged Shot QA

Distribution: `Grandis_Legacy_VS_AI_Season0_v1.0_RC35_2026-11-08.zip` (outer version stays RC35).

## Changed

- Tribute target no longer migrates left-to-right after initial EXP investment. Rank I focus continues through Rank II; Rank II focus locks after two normal Tributes (500 EXP) and stays until Rank III (700 EXP). The lock follows Hero identity across positions.
- Finishing Rank I at 200 EXP and Rank II at 600 EXP gets high priority for the exactly +100 Tribute, with immediate Draw 2/3 bonuses from Rank Up. Normal Skill and Ultimate overflow prevented.
- Intermediate Battle planner and final action selector preserve Silver/Gold printed-rank Skill attacks before appropriate Rank, and hold the last usable normal Skill for a pending 100 EXP Tribute, except for a credible match-winning attack. Gold is allowed at Rank II 300/400 EXP and saved again at 500/600.
- Soul Charged Shot (`S0-ARC-018`) is prioritized specifically as a TRUE Range Attack: the target lies outside normal AoA and the source's RANGE conversion makes the Attack legal, triggering the existing damage doubling. Do not interpret the conditional text as free RANGE. If a non-Range attack is already immediately lethal and the Range attack is not, the lethal still wins. Beginner remains unchanged.

## Validation

- Intermediate/difficulty/regression targeted suite: 33/33 PASS; three consecutive repetitions PASS.
- Existing gameplay engine regression: 20/20 PASS.
- `node --check` for updated bundle and associated runtime UI JS: PASS.
- Source card definitions, assets, Rulebook authority and Starter 4/5 decks: unchanged.
- Archive CRC check performed separately after packaging.

## Caveats

Tests use controlled engine state, including paid action resolution and selection. Full natural-match end-to-end and physical Android browser testing are not claimed.
