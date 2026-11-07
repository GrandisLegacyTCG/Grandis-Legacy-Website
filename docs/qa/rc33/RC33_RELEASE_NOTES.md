# Grandis Legacy — VS AI Season 0 v1.0 RC33 (2026-11-08)

**Released:** v1.0 RC33, based on official `Grandis_Legacy_VS_AI_Season0_v1.0_RC32_2026-11-07.zip`. **Status: RELEASE CANDIDATE — NOT FINAL.**

## Implemented asset/UI update (Part 5)

- Added `Tavern Quest.mp3` as optional looping background music (OFF by default). Existing SFX remains ON by default. Battlefield **Sound** button expands an upward 2-row Music/SFX toggle panel; outside click or Escape closes. Music preference uses separate localStorage key; saved prior preferences take precedence. Browser autoplay policy still applies.
- Replaced battlefield Racial Token Heads/Tails and coin flip images in the original shared asset paths, using `Heads-Human.png` and `Tails.png` (800x800 conversion); **no coin outcome/game mechanics changed**.
- Added six Race button PNGs, `Support Button.png` for active Class Ability, `Racial Legacy Button.png` for Legacy Ability. Only actions **already legal/visible under RC32** render as buttons. Trigger-only/passive effects such as **Stoneblood** have no normal Hero-side button. Existing custom hover/focus tooltip and click callbacks are retained; no duplicate browser-native title tooltip for art buttons. Original button graphic size is 30x30 px.

## AI/animation corrections

1. **CONFIRMED RC32 root cause — Primal Strike Response:** `resolveAbilityDamageResponseWindow()` closed the Response Window but did not invoke `resumeAITurnAfterPlayerResponse()`. After a Player PASS/Chain Mail/Dragon Scale/Second Chance, the AI turn remained paused. A single narrow handoff now occurs after all mandatory gates are closed; pending Stoneblood/Legacy/Saint choices are not skipped.
2. **Saint Purify/Holy Rejuvenation choice:** `commitSaintPurifyChoice()` now hands back control only after the **last** mandatory queued status-removal choice closes, if an AI turn actually awaited a Player choice. Also permits existing automatic Player End Phase to continue, matching other mandatory-choice completion handlers. **QA used a constructed legal-status paused-AI fixture**; a naturally occurring stuck case was not independently proven.
3. **Animation queue robustness:** Card-flight and parallel-card-flight WAAPI finish/cancel callbacks are now single-commit. If a browser never fires either callback, a deferred `duration + 1250 ms` watchdog completes the **presentation** and its existing callback. This avoids leaving the presentation queue permanently busy while preserving normal animation duration. **QA induced missing events deliberately**; not a claim that this was a confirmed normal-browser root cause.
4. Updated the visible engine version identifier to **v1.0 RC33**. No new card balances, rules, AI strategy, OSA changes, or other product changes.

## Scoped QA and limits

- **5/5 PASS:** Primal Strike handoff under PASS, Chain Mail, Dragon Scale, Second Chance; queued Saint Purify final choice.
- **3/3 PASS:** Single animation no WAAPI completion, parallel animation no completion, duplicate callback idempotence.
- **PASS:** AI Director progresses through Reform/End into the next Player Deploy Phase after responding to Primal Strike.
- **7/7 PASS:** Six Race icon mappings, Class/Legacy artwork, custom tooltip hover, and synthetic Stoneblood/no-active-action rendering.
- **PASS:** Production engine + runtime scripts boot without page errors under an in-memory Chromium DOM, Sound panel defaults and expand/outside collapse.
- **Historical regressions:** 4/10 PASS in the scoped Season 0 Chromium harness; 6/10 FAIL **identically on the untouched RC32 baseline** in the same environment. These older legacy fixtures/test expectations were not reclassified as new RC33 regressions or silently fixed. See JSON comparisons.
- **NOT VERIFIED:** an entire natural Human-vs-AI match, native Firefox, hosted page navigation in this environment, device-audible music, and naturally occurring Saint Purify/Stoneblood interactions through a full game. In-memory DOM QA is **not** equivalent to deployed end-to-end game QA.

**Rule authority:** current official Player Rulebook v3.0. Older internal machine-rules/packaged v2.9 historical documents were not rewritten as part of this scope. OSA Season 0 DEV45, Deck Builder and PvP remain unchanged.

## Audit links

- `RC33_QA_SUMMARY.json`
- `RC33_AI_HANDOFF_ANIMATION_REGRESSION_QA.json`
- `RC33_UI_ASSET_INTEGRATION_QA.json`
- `RC32_SAME_ENV_BASELINE_REGRESSION.json`
