# Grandis Legacy VS AI Season 0 — RC33 (same version), Card Played / Battle Log / Hero Action Button Revision

**Date:** 2026-11-08  
**Baseline:** Most recently delivered RC33 from `rc33_part5_updated/Grandis_Legacy_VS_AI_Season0_v1.0_RC33_2026-11-08.zip`.  
**Scope authorized:** Fix chronological order of Card Played and Full Card History; make countered response-card details show the clicked card and outcome; put newest Battle Log at the bottom; revert enlarged Racial/Class ability image buttons to previous size. Keep version at RC33.  
**Other apps / gameplay data:** Not changed.

## Issues, fixes, and coverage

| ID | Expected | Code diagnosis | Change | Status |
|---|---|---|---|---|
| H1 | 6 latest played actions displayed oldest-to-newest, including a three-card Response chain | External runtime sorted descending by millisecond timestamp | Added global per-match `played_event_order` for presentation in existing card-event recorders, sorted ascending in external history, selected latest six while maintaining ascending display; Full Card History also ascending. Explicit event sequence handles same-millisecond events. | FIXED, controlled QA PASS |
| H2 | Clicking NEGATED Tactical Adaptation opens its own card/result (not Scouting) | `getCardPlayedDetail` matched a chain member but rendered parent `group.event` | Event lookup by exact `(side,eventId)`; parent retains optional chain context, child displays itself. Added explicit Resolution label if present. Adjusted legacy helper mapping to clicked event ID. | FIXED, controlled QA PASS |
| H3 | Battle Log chronological, newest line last; auto-follow only when reader is already at bottom | Engine uses `state.log.unshift` (newest-first), UI followed raw array | Render a reversed COPY of state.log; no mutation of engine log; preserve scroll if scrolled up; jump to bottom on opening Battle Log. | FIXED, controlled QA PASS |
| H4 | Racial/Class hero buttons restored to 30×30px (same as initial RC33 assets) | Part 5 override forced 36×36px | Removed 36px override. Base 30px CSS applies to Racial, Class and Legacy artwork buttons with unchanged alignment/tooltip/visibility/behavior. | FIXED, measured Chromium QA PASS |

## Files changed

1. `engine/shared-app/app.bundle.js`: presentation sequence metadata + exact played-card detail routing. No damage, Mana, Response, or gameplay-resolution code changed.
2. `shared-app/app-runtime.js`: Card Played ordering + Battle Log presentation/scroll logic.
3. `shared-ui/battlefield-ui.css`: remove 36px ability icon override; default is 30px.
4. `README.md`: RC33 supplement note.
5. This QA report: new documentation.

All existing files outside the four edited source/docs paths are byte-for-byte identical to the delivered RC33 ZIP baseline.

## Verified QA

- `node --check` for edited JS: **PASS**.
- Chromium rendering + genuine game source with QA functions injected **in memory only**, no QA injection packaged: **12/12 PASS**.
  - Three-action Scouting → Player Tactical Adaptation (NEGATED) → AI Tactical Adaptation (RESOLVED).
  - Six newest chronological / Full Card History of nine events.
  - Identical millisecond timestamps, resolved with `played_event_order`.
  - Clicked NEGATED response card's own image, title, result, RESOLUTION badge; separate original and AI counter details.
  - Battle Log render order, auto-follow, manual scroll preservation.
  - Hero action button computed size 30×30px.
- Previously passing engine tests rerun in this environment:
  - `GL_S0_RC6_LINEAGE_EFFECT_REGRESSION_QA_SELF_TEST`: **PASS**, 6,975 lineage cases.
  - `GL_S0_TARGET_SELECTION_QA_SELF_TEST`: **PASS**, 13/13 scenarios.
  - `GL_S0_ULTIMATE_TRIBUTE_QA_SELF_TEST`: **PASS**, 30/30 successful scenarios (15 Ultimate card identities × 2 sides).
- Browser JavaScript exceptions during focused QA: **0**.

## Limitations and open work

- **NOT VERIFIED:** Full natural Human vs AI match all the way to terminal outcome; Firefox and production-hosting behavior; real-world multi-step/touch and screen-size checks.
- These fixes are UI/presentation-only except for an added non-gameplay event-order counter. QA does not establish that all previous RC33 gameplay findings were resolved.
- Stoneblood × Poison earlier user report remains a separate open investigation (not modified here).
- Previous known baseline QA failures were not reclassified as PASS and were not addressed in this limited revision.

**Release version remains RC33; not FINAL.**
